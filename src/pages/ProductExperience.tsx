import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { getFingerprint } from '../lib/fingerprint'
import { parseNFCParams, areParamsValid } from '../lib/urlParams'
import { useCampaignTheme } from '../hooks/useCampaignTheme'
import type { UnitWithRelations } from '../types/database'

export default function ProductExperience() {
  const { lang, brand } = useParams<{ lang: string; brand: string }>()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unitData, setUnitData] = useState<UnitWithRelations | null>(null)
  const [isFirstScan, setIsFirstScan] = useState(true)

  // Parse URL parameters
  const params = parseNFCParams(lang, brand, searchParams)

  // Apply campaign theme
  useCampaignTheme(unitData?.campaigns || null)

  useEffect(() => {
    async function loadProductExperience() {
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

        const preRegRequired = preRegSetting?.value === 'true'

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

        const cooldownSeconds = cooldownSetting ? parseInt(cooldownSetting.value, 10) : 300 // Default: 300s = 5min

        // Check scan history
        const fingerprint = await getFingerprint()

        const { data: scanData } = await supabase
          .from('scans')
          .select('scan_count, first_scan_at')
          .eq('uid', params.uid)
          .eq('device_fingerprint', fingerprint)
          .maybeSingle()

        // Determine if this is first scan with cooldown period check
        let isFirstTime = !scanData

        if (scanData && scanData.first_scan_at) {
          // Check if cooldown period has passed
          const firstScanTime = new Date(scanData.first_scan_at).getTime()
          const now = new Date().getTime()
          const secondsPassed = (now - firstScanTime) / 1000

          // If within cooldown period, still show first scan experience
          if (secondsPassed < cooldownSeconds) {
            isFirstTime = true
          }
        }

        setIsFirstScan(isFirstTime)

        // Record scan (happens after determining first scan state)
        await supabase
          .from('scans')
          .upsert(
            {
              uid: params.uid,
              device_fingerprint: fingerprint,
              scan_count: (scanData?.scan_count || 0) + 1,
              last_scan_at: new Date().toISOString(),
              user_agent: navigator.userAgent,
            },
            {
              onConflict: 'uid,device_fingerprint',
            }
          )

        setLoading(false)
      } catch (err) {
        console.error('Error loading product experience:', err)
        setError(t('errors.networkError'))
        setLoading(false)
      }
    }

    loadProductExperience()
  }, [params, t])

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
    <div className="min-h-screen">
      {isFirstScan ? (
        <UnboxingExperience unitData={unitData} />
      ) : (
        <SupportHub unitData={unitData} />
      )}
    </div>
  )
}

// Placeholder components (to be implemented in Phase 2)
function UnboxingExperience({ unitData }: { unitData: UnitWithRelations }) {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-6" style={{ color: 'var(--campaign-primary)' }}>
          {t('welcome.title', { productName: unitData.products.name })}
        </h1>
        <p className="text-xl text-gray-600 mb-4">{t('welcome.subtitle')}</p>
        <p className="text-sm text-gray-500">
          Campaign: {unitData.campaigns.name} | Product: {unitData.products.name}
        </p>
        <div className="mt-8">
          <p className="text-gray-500">Phase 2: Unboxing experience with 3D model coming soon...</p>
        </div>
      </div>
    </div>
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
