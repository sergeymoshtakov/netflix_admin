export interface Episode {
  id: number;
  title: string;
  description: string;
  duration: number;
  releaseDate: string;
  videoPath?: string;
}
  
export interface Series {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  rating: number;
  episodes: Episode[];
  categories: Category[];
  trailerPath?: string;
}

export interface Category{
  id: number;
  title: string;
}

export interface SeriesCategory{
  id: number;
  series_id: number;
  category_id: number;
}