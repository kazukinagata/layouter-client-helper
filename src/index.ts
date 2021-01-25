import axios from 'axios'

export type Tag = 'input' | 'textArea'
export interface SVGFormAttrs {
  id: string
  tag: Tag
  label: string
  fieldId: string
  value: string
  order: number
  parent?: string
}
export interface SVGForm {
  [inputId: string]: SVGFormAttrs
}
export interface Inputs {
  [svgId: string]: {
    name: string
    elements: SVGForm
  }
}

export interface UpdateParam {
  uuid: string
  value: string
}

const DEFAULT_API_ROOT = 'http://localhost:9000/api/v1'
export default class {
  constructor(
    private token: string,
    private docId: string,
    private version?: string | number,
    private apiRoot: string = DEFAULT_API_ROOT,
    private debug: boolean = false

  ) {}

  static prepareData(data: Inputs): UpdateParam[] {
    return Object.keys(data).reduce<UpdateParam[]>((result, key) => {
      const { elements } = data[key]
      return [
        ...result,
        ...Object.keys(elements).map((key) => ({
          uuid: key,
          value: elements[key].value,
        })),
      ]
    }, [])
  }

  async getInit(): Promise<string[]> {
    try {
      const res = await axios.get<string[]>(
        `${this.apiRoot}/svg/${this.docId}`,
        {
          params: {
            token: this.token,
            version: this.version,
          },
        }
      )
      return res.data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async update(params: UpdateParam[]) {
    try {
      const res = await axios.post<{svg: string[], pdf: string}>(`${this.apiRoot}/svg/${this.docId}`, {
        token: this.token,
        version: this.version,
        params,
      })
      return res.data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async toPng(params: UpdateParam[], size: 'thumbnail' | 'full' = 'full') {
    // do something stuff
    const res = await axios.post<{ type: string; data: ArrayBuffer }[]>(
      `${this.apiRoot}/svg/${this.docId}/png`,
      {
        token: this.token,
        version: this.version,
        params,
        size,
      }
    )
    return res.data.map((d) => d.data)
  }

  async getThumbnail() {
    // do something stuff
    const res = await axios.get<string[]>(
      `${this.apiRoot}/svg/${this.docId}/thumbnail`,
      {
        params: {
          token: this.token,
          version: this.version,
        },
      }
    )
    return res.data
  }

  async batchCreate(contents: { [clientId: string]: UpdateParam[] }) {
    const res = await axios.post<{id: string}>(`${this.apiRoot}/batch`, {
      token: this.token,
      version: this.version,
      layoutId: this.docId,
      contents,
    })
    return res.data
  }

  async batchPolling(id: string) {
    const res = await axios.get<{
      status: 'completed' | 'waiting' | 'active' | 'delayed' | 'failed' | 'paused',
      value?: {[clientId:string]: {svg: string[], pdf: string}},
      progress: number,
      id: string,
    }>(`${this.apiRoot}/batch/${id}`, {
      params: {
        token: this.token,
        version: this.version,
        layoutId: this.docId,
      }
    })

    if (this.debug) {
      console.log('batchPolling', res.data)
    }
    return res.data
  }
}
