export interface SeismicEvent {
    id: string;
    time: string;
    lat: number;
    lon: number;
    depth: number;
    mag: number;
    magtype: string;
    region: string;
    auth: string;
  }
  
  export interface SeismicMessage {
    action: string;
    data: {
      type: string;
      geometry: {
        type: string;
        coordinates: [number, number, number];
      };
      id: string;
      properties: {
        source_id: string;
        source_catalog: string;
        lastupdate: string;
        time: string;
        flynn_region: string;
        lat: number;
        lon: number;
        depth: number;
        evtype: string;
        auth: string;
        mag: number;
        magtype: string;
        unid: string;
      };
    };
  }