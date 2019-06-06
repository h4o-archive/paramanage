### FUNCTION ARGUMENTS

# ACTION CREATORS
/**
*
* Passing arguments as normal
*
**/
function action (param1, param2, ...)

# OTHERS
/**
*
* Passing arguments as object with key
*
**/
function other ({key1: param1, key2: param2,...})

/**
*
* Passing default parameter as normal, rests as object with key
*
**/
function other (dispatch, getState, {key1: param1, key2: param2,...})

/**
*
* 1 argument as normal
*
**/
function other (param1)
function other (dispatch, getState, param1)

### CHECK
1/ Refactor component
2/ Comment code
3/ Function parameters
4/ Default/Fallback Syntax
5/ Variable names