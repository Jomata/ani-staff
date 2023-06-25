export interface AnimeInfo {
  id: number;
  title: string;
  siteUrl: string;
  bannerUrl: string;
  coverUrl: string;
}
export interface AnimeSearchResult extends AnimeInfo {}
export interface AnimeInfoWithStaff extends AnimeInfo {
  popularity: number; //for sorting
  staff: StaffInfo[];
}
export interface StaffInfo {
  id: number;
  name: string;
  roles: string[];
}
export interface StaffRole {
  edgeId: number;
  staffId: number;
  staffName: string;
  image: string;
  siteUrl: string;
  role: string;
}
