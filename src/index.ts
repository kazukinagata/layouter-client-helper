import axios from 'axios'

export type SVGForm = {
  [inputId: string]: {
    id: string
    tag: string
    label: string
    value: string
  }
}
type Inputs = {
  [svgId: string]: SVGForm
}

type UpdateParam = { uuid: string; value: string }

const DEFAULT_API_ROOT = 'https://layouter-editor-server.herokuapp.com'
export default class {
  constructor(private token: string, private docId: string, private apiRoot: string = DEFAULT_API_ROOT) {}

  static prepareData(data: Inputs): UpdateParam[] {
    return Object.keys(data).reduce<UpdateParam[]>((result, key) => {
      const fields = data[key]
      return [
        ...result,
        ...Object.keys(fields).map((key) => ({
          uuid: key,
          value: fields[key].value,
        })),
      ]
    }, [])
  }

  async initialize(): Promise<string[]> {
    try {
      const res = await axios.get<string[]>(
        `${this.apiRoot}/api/svg/${this.docId}`,
        {
          params: {
            token: this.token,
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
      const res = await axios.post<string[]>(
        `${this.apiRoot}/api/svg/${this.docId}`,
        {
          token: this.token,
          params,
        }
      )

      return res.data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async toPng(params: UpdateParam[]) {
    // do something stuff
    const res = await axios.post<ArrayBuffer[]>(
      `${this.apiRoot}/api/svg/${this.docId}/png`,
      {
        token: this.token,
        params,
      }
    )
    return res.data
  }

  async getThumbnail() {
    // do something stuff
    const res = await axios.get<ArrayBuffer[]>(
      `${this.apiRoot}/api/svg/${this.docId}/thumbnail`
    )
    return res.data
  }
}
