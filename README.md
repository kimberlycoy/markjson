# markjson

Convert markdown to json. Why? Sometimes you have simple static data that's best
delivered as json. However, creating and editing json is a pain, especially for
non techies. Markdown, on the other hand, is easy.

## Installation

```bash
npm install https://github.com/kimberlycoy/markjson.git
```

## Usage

```js
// node
const markjson = require("markjson");
let md = "# Some Markdown ...";
let json = markjson(md);
```

```bash
# cli
$ bin/markjson 

markjson [file.md...]

--help, -h       This message.
--format, -f     Format the json. Defaults to 2 spaces.
--concat, -c     Concat the json of each file into one object. 
--output, -o     Write the json to [filename.md].json. Or, 
                 output.json if multiple markdown files.
    

```

## Example

This

    # Lorem Ipsum

    ```
    title: Lorem Ipsum
    description: ultrices posuere cubilia Curae
    generator: https://www.lipsum.com
    ```

    ## A

    Lorem ipsum dolor sit amet...

    ### A1

    ```
    level: 2
    description: It's dark down here.
    ```

    Cras efficitur tempor tincidunt.

becomes

```json
{
    "Lorem Ipsum": {
        "title": "Lorem Ipsum",
        "description": "ultrices posuere cubilia Curae",
        "generator": "https://www.lipsum.com",
        "A": {
            "content": "Lorem ipsum dolor sit amet...",
            "A1": {
                "level": 2,
                "description": "It's dark down here.",
                "content": "Cras efficitur tempor tincidunt."
            }
        }
    }
}
```
