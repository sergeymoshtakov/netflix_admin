export interface Episode {
    id: number;
    title: string;
    description: string;
    duration: number;
    releaseDate: string;
  }
  
  export interface Series {
    id: number;
    title: string;
    description: string;
    releaseDate: string;
    rating: number;
    episodes: Episode[];
  }