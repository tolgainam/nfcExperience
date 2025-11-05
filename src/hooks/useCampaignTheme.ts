import { useEffect } from 'react'
import type { Campaign } from '../types/database'

/**
 * Apply campaign theme colors to CSS variables
 */
export function useCampaignTheme(campaign: Campaign | null) {
  useEffect(() => {
    if (!campaign) return

    // Apply campaign colors to CSS variables
    document.documentElement.style.setProperty(
      '--campaign-primary',
      campaign.theme_primary
    )
    document.documentElement.style.setProperty(
      '--campaign-secondary',
      campaign.theme_secondary
    )
    document.documentElement.style.setProperty(
      '--campaign-accent',
      campaign.theme_accent
    )

    // Optional: Add campaign name as data attribute for styling hooks
    document.documentElement.setAttribute('data-campaign', String(campaign.cc))
  }, [campaign])
}

/**
 * Get campaign theme colors as object
 */
export function getCampaignColors(campaign: Campaign | null) {
  if (!campaign) {
    return {
      primary: '#0066CC',
      secondary: '#00AAFF',
      accent: '#66D9FF',
    }
  }

  return {
    primary: campaign.theme_primary,
    secondary: campaign.theme_secondary,
    accent: campaign.theme_accent,
  }
}
