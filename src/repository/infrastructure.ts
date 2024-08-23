export interface fetchAPI{
  getContent(path:string, body:string): Promise<{[key:string]:string}>;
  postContent(path:string, body:string): Promise<{[key: string]: string}>;
}