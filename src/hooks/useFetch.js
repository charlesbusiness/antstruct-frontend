import { useEffect, useState } from 'react'
import axios from 'axios'
import http from '../services/authentication/httpService'

export default function useFetch(pageNumber, endpoint) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [data, setData] = useState([])
  const [hasMore, setHasMore] = useState(false)


  useEffect(() => {
    setData([])
  }, [endpoint])

  useEffect(() => {
    setLoading(true)
    setError(false)
    let cancel
    axios({
      method: 'GET',
      url: `${http.setURL}/${endpoint}`,
      headers: http.setJwtHeaders().headers,
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
      setData((prevData) => {
        return [...new Set([...prevData, ...res.data.data.items.map((data) => data)])]
      })
      setHasMore(res.data.docs.length > 0)
      setLoading(false)
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })
    return () => cancel()
  }, [endpoint, pageNumber])

  return { loading, error, data, hasMore }
}