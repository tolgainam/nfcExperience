import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { parseNFCParams, areParamsValid } from '../lib/urlParams'
import { useCampaignTheme } from '../hooks/useCampaignTheme'
import UnboxingExperience from '../components/UnboxingExperience'
import { ErrorBoundary } from '../components/ErrorBoundary'
import type { UnitWithRelations } from '../types/database'

export default function ProductExperience() {
  const { lang, brand } = useParams<{ lang: string; brand: string }>()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unitData, setUnitData] = useState<UnitWithRelations | null>(null)
  const [isFirstScan, setIsFirstScan] = useState(true)
  const hasLoadedRef = useRef<string | null>(null)

  // Parse URL parameters
  const params = parseNFCParams(lang, brand, searchParams)

  // Apply campaign theme
  useCampaignTheme(unitData?.campaigns || null)

  useEffect(() => {
    // Create a unique key for this load
    const loadKey = `${params.uid}-${params.prd}-${params.cc}`

    // Prevent multiple executions for the same product
    if (hasLoadedRef.current === loadKey) {
      console.log('Already loaded, skipping...')
      return
    }

    async function loadProductExperience() {
      console.log('Loading product experience...', loadKey)

      // Validate parameters
      if (!areParamsValid(params)) {
        setError(params.errors.join(', '))
        setLoading(false)
        return
      }

      try {
        // Fetch pre-registration setting
        const { data: preRegSetting } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'pre_registration_required')
          .maybeSingle()

        const preRegRequired = (preRegSetting as any)?.value === 'true'

        // Handle unit data based on pre-registration mode
        if (preRegRequired) {
          // Mode 1: Pre-registration required - validate uid exists in units table
          const { data: unit, error: unitError } = await supabase
            .from('units')
            .select(`
              *,
              products (*),
              campaigns (*)
            `)
            .eq('uid', params.uid)
            .single()

          if (unitError || !unit) {
            setError(t('errors.invalidUnit'))
            setLoading(false)
            return
          }

          setUnitData(unit as unknown as UnitWithRelations)
        } else {
          // Mode 2: Pre-registration not required - build unit data from URL parameters
          const { data: product } = await supabase
            .from('products')
            .select('*')
            .eq('prd', params.prd)
            .eq('brand', params.brand)
            .maybeSingle()

          const { data: campaign } = await supabase
            .from('campaigns')
            .select('*')
            .eq('cc', params.cc)
            .maybeSingle()

          if (!product || !campaign) {
            setError(t('errors.invalidProductOrCampaign'))
            setLoading(false)
            return
          }

          // Create virtual unit from URL params
          setUnitData({
            uid: params.uid,
            prd: params.prd,
            brand: params.brand,
            cc: params.cc,
            manufactured_at: null,
            created_at: new Date().toISOString(),
            products: product,
            campaigns: campaign
          } as UnitWithRelations)
        }

        // Fetch cooldown setting (in seconds)
        const { data: cooldownSetting } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'scan_cooldown_seconds')
          .maybeSingle()

        const cooldownSeconds = cooldownSetting ? parseInt((cooldownSetting as any).value, 10) : 300 // Default: 300s = 5min

        // Check scan history (UID-only approach - no fingerprinting)
        const { data: scanData } = await supabase
          .from('scans')
          .select('scan_count, first_scan_at')
          .eq('uid', params.uid)
          .maybeSingle()

        // Determine if this is first scan with cooldown period check
        let isFirstTime = !scanData

        if (scanData && (scanData as any).first_scan_at) {
          // Check if cooldown period has passed
          const firstScanTime = new Date((scanData as any).first_scan_at).getTime()
          const now = new Date().getTime()
          const secondsPassed = (now - firstScanTime) / 1000

          // If within cooldown period, still show first scan experience
          if (secondsPassed < cooldownSeconds) {
            isFirstTime = true
          }
        }

        setIsFirstScan(isFirstTime)

        // Record scan (happens after determining first scan state)
        // Mark as loaded to prevent re-execution
        hasLoadedRef.current = loadKey

        try {
          if (scanData) {
            // Update existing scan
            const { error: updateError } = await supabase
              .from('scans')
              .update({
                scan_count: ((scanData as any).scan_count || 0) + 1,
                last_scan_at: new Date().toISOString(),
              })
              .eq('uid', params.uid)

            if (updateError) {
              console.error('Error updating scan:', updateError)
            } else {
              console.log('Scan updated successfully')
            }
          } else {
            // Insert new scan
            const { error: insertError } = await supabase
              .from('scans')
              .insert({
                uid: params.uid,
                scan_count: 1,
                first_scan_at: new Date().toISOString(),
                last_scan_at: new Date().toISOString(),
                user_agent: navigator.userAgent,
              })

            if (insertError) {
              console.error('Error inserting scan:', insertError)
            } else {
              console.log('Scan inserted successfully')
            }
          }
        } catch (scanError) {
          // Non-blocking: log but don't fail the page load
          console.error('Scan recording error:', scanError)
        }

        setLoading(false)
      } catch (err) {
        console.error('Error loading product experience:', err)
        setError(t('errors.networkError'))
        setLoading(false)
      }
    }

    loadProductExperience()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.uid, params.prd, params.cc, lang, brand])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-campaign-primary mx-auto mb-4"></div>
          <p className="text-lg">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (error || !unitData) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">{t('common.error')}</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-campaign-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    )
  }

  // Render appropriate experience based on scan history
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        {isFirstScan ? (
          <UnboxingExperience unitData={unitData} />
        ) : (
          <SupportHub unitData={unitData} />
        )}
      </div>
    </ErrorBoundary>
  )
}

function SupportHub({ unitData }: { unitData: UnitWithRelations }) {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-6" style={{ color: 'var(--campaign-primary)' }}>
          {t('support.title')}
        </h1>
        <p className="text-lg text-gray-600 mb-4">{unitData.products.name}</p>
        <p className="text-sm text-gray-500">
          Campaign: {unitData.campaigns.name}
        </p>
        <div className="mt-8">
          <p className="text-gray-500">Phase 4: Support hub content coming soon...</p>
        </div>
      </div>
    </div>
  )
}
