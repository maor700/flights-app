export interface FlLayer {
  displayName: string;
  id: string;
  description: string;
}

export interface FlItem<T extends Record<string, any> = Record<string, any>> {
  id: string;
  data: T;
}

export type GeoData = {
  layers: FlLayer[];
  items: FlItem[];
};

export type GeoDataActions = {
  addLayer: (Layer: FlLayer) => void;
  deleteLayer: (id: string) => void;
  addItems: (Items: FlItem[]) => void;
  deleteAllItems: () => void;
};

export type GeoDataStore = GeoData & GeoDataActions;
