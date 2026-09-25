export interface AssetInfo {
  src: string;
  width: number;
  height: number;
  blur?: string;
}

export interface SiteAssets {
  helaCover: AssetInfo | null;
  ericCover: AssetInfo | null;
  portrait: AssetInfo | null;
}
