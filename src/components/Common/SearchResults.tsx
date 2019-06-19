import React, { useState, useEffect } from "react"
import { connect } from "react-redux"

import { State } from "reducers";

type SearchResultsMapProps = {
  readonly search_term: string
}

type SearchResultsOwnProps = {
  getData: () => string,
  source: string[],
  onClick: (result: string) => void,
  style?: React.CSSProperties
}

const SearchResults: React.FunctionComponent<SearchResultsMapProps & SearchResultsOwnProps> = ({ search_term, style, source, onClick }) => {

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

    return function cleanup() {
      setResults([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search_term])

  if (results.length > 0) {
    return (
      <div className="ui search" style={style}>
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

function mapStateToProps(state: State, ownProps: SearchResultsOwnProps) {
  return {
    search_term: ownProps.getData() || ""
  }
}

const ConnectedSearchResults = connect<SearchResultsMapProps, {}, SearchResultsOwnProps, State>(mapStateToProps)(SearchResults)
export { ConnectedSearchResults as SearchResults }