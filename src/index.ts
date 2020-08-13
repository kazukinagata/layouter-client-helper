import axios from 'axios'

const API_ROOT = process.env.NODE_ENV === 'production' ? 'any' : 'http://localhost:9000'
export default class {
  constructor(private token: string, private docId: string) {}

  async load(): Promise<string[]> {
    try {
      const res = await axios.get<string[]>(
        `${API_ROOT}/api/svg/${this.docId}`,
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

  async update(params: {uuid: string, value: string}) {
    try {
      const res = await axios.post<string[]>(
        `${API_ROOT}/api/svg/${this.docId}`,
        {
          token: this.token,
          params
        }
      )

      return res.data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async toPng(params: {uuid: string, value: string}) {
    // do something stuff
    const res = await axios.post<ArrayBuffer[]>(`${API_ROOT}/api/svg/${this.docId}/png`, {
      token: this.token,
      params
    })
    return res.data
  }

  async getThumbnail() {
    // do something stuff
    const res = await axios.get<ArrayBuffer>(`${API_ROOT}/api/svg/${this.docId}/thumbnail`)
    return res.data
  }
}
