import {ResponseBody} from "../common";
import {Control} from "../../../shared/control/type";

export type MetaExtension = {
  taxonomy: string;
  forms: Control[];
}

export type TaxonomyExtension = Omit<MetaExtension & ResponseBody, "taxonomy">;
