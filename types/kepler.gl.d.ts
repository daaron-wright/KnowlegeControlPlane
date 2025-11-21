declare module "kepler.gl" {
  import { FC } from "react";

  interface KeplerGlProps {
    id: string;
    width?: string | number;
    height?: string | number;
    mapboxApiAccessToken?: string;
    appName?: string;
    [key: string]: any;
  }

  const KeplerGl: FC<KeplerGlProps>;
  export default KeplerGl;
}

declare module "kepler.gl/actions" {
  export function addDataToMap(payload: {
    datasets: Array<{
      info: {
        id: string;
        label: string;
        [key: string]: any;
      };
      data: {
        fields: Array<{
          name: string;
          type: string;
          format?: string;
        }>;
        rows: Array<any[]>;
      };
    }>;
    options?: {
      centerMap?: boolean;
      readOnly?: boolean;
      [key: string]: any;
    };
    config?: any;
  }): any;
}

declare module "kepler.gl/dist/actions" {
  export * from "kepler.gl/actions";
}

declare module "kepler.gl/reducers" {
  export function wrapTo(id: string, reducer: any): any;
  export const keplerGlReducer: any;
}

declare module "kepler.gl/dist/reducers" {
  export * from "kepler.gl/reducers";
}

declare module "kepler.gl/processors" {
  export function processCsvData(data: any): any;
}

declare module "kepler.gl/schemas" {
  const KeplerGlSchema: any;
  export default KeplerGlSchema;
}

declare module "react-palm/tasks" {
  export const taskMiddleware: any;
}
