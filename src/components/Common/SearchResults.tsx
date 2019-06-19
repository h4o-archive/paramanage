import React, { useState, useEffect } from "react"

type SearchResultsOwnProps = {
  getData: () => string,
  source: string[],
  onClick: (result: string) => void
}

export const SearchResults: React.FunctionComponent<SearchResultsOwnProps> = ({ getData, source, onClick }) => {

  const search_term = getData() || ""
  const [results, setResults] = useState([] as string[])

  useEffect(() => {
    if (search_term.length > 0) {
      const temp = source.reduce((results, item) => {
        if (item.search(search_term) !== -1) {
          if (item.length !== search_term.length) results.push(item)
          else onClick(item)
        }
        return results
      }, [] as string[])
      setResults(temp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search_term])

  if (results.length > 0) {
    return (
      <div className="ui search">
        <div className="results transition visible">
          {results.map(result => {
            return (
              // TODO passing child result element
              <div key={result} className="result" onClick={() => onClick(result)}>
                {result}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  return null
}