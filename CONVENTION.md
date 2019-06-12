####### FUNCTION ARGUMENTS

# ACTION CREATORS

* Passing arguments as normal
function action (param1, param2, ...)

# OTHERS

* Passing arguments as object with key if agrs > 2
function other ({key1: param1, key2: param2,...})

* Passing default parameter as normal, rests as object with key
function other (dispatch, getState, {key1: param1, key2: param2,...})

* args <= 2 as normal
function other (param1, param2)
function other (dispatch, getState, param1)

####### REFACTOR CRITERIA
1/ Refactor component
2/ Comment code
3/ Function parameters
4/ Default/Fallback Syntax
5/ Variable names

### WHERE TO DECLARE TYPE
# export type
At the end
# type
line above where it is used

####### TYPESCRIPT SYNTAX

# Readonly<> if property >= 2 otherwise readonly modifier

* ONLY CHOICE when define type / no need for object initialization, REQUIRE Readonly<> for nested object / index signature
* POSSIBLE for object initialization using typeof with 1 level of property

# as const

* NOT POSSIBLE when no need for object initialization
* HIGHLY RECOMMEND when object has nested object
* use with type assertion object index signature REQUIRE Readonly<>
* KNOWN ISSUE: https://github.com/microsoft/TypeScript/issues/31856

# reducer

* ALWAYS use "as const"

####### WHEN TO EXTRACT FUNCTION ?
when the parameter passed in is needed for both this function and the extracting function.
if the parameter passed is required only by the extracting function, that function should be a local function