export interface FetchAPIRepository{
  getContent(path:string, body:{[key:string]:string}): Promise<{[key:string]:string}>;
  postContent(path:string, body:{[key:string]:string}): Promise<{[key: string]: string}>;
}