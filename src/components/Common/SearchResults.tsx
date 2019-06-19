import React, { useState, useEffect, useRef } from "react"
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
  const [clicked, setClicked] = useState(false)
  const prev_search_tem = useRef("")

  useEffect(() => {
    if (search_term.length > 0) {
      const temp = source.reduce((results, item) => {
        if (item.search(search_term) !== -1) {
          if (item.length !== search_term.length) results.push(item)
          else if (prev_search_tem.current !== "" && !clicked) onClick(item)
        }
        return results
      }, [] as string[])
      setResults(temp)

      prev_search_tem.current = search_term
      return function cleanup() {
        setClicked(false)
        setResults([])
      }
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
              <div key={result} className="result" onClick={() => { onClick(result); setClicked(true) }}>
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