import React, { useEffect } from "react"

type SearchResultsOwnProps = {
  getData: () => string,
  source: string[],
  onClick: (result: string) => () => void
}

export const SearchResults: React.FunctionComponent<SearchResultsOwnProps> = ({ getData, source, onClick }) => {

  const search_term = getData() || ""
  let results = [] as string[]

  useEffect(() => {
    if (search_term.length > 0) {
      results = source.reduce((results, item) => {
        if (item.search(search_term) !== -1 && item.length !== search_term.length) {
          results.push(item)
        }
        return results
      }, [] as string[])
    }
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

// function mapStateToProps(state, { params = {}, ...ownProps }) {
//   let search_term = ownProps.getData(params) || ""

//   let results = []
//   ownProps.source.map(item => {
//     if (search_term.length > 0 && item.search(search_term) !== -1 && item.length !== search_term.length) {
//       results.push(item)
//     }
//     return null
//   })

//   return {
//     results
//   }
// }

// export default connect(mapStateToProps)(SearchResults)