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

## Examples

This ([example.md](example.md))

    # Lorem Ipsum

    ```
    title: Lorem Ipsum
    description: ultrices posuere cubilia Curae
    ```

    ## A

    Lorem ipsum dolor sit amet...

    ### A1

    ```
    level: 2
    description: It's dark down here.
    alt: ["Aone", 1]
    ```

    - Sed
    - Quis
    - Eget

    Cras efficitur tempor tincidunt.

becomes ([example.md.json](example.md.json))

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
                "alt": ["Aone", 1],
                "list": ["Sed", "Quis", "Eget"],
                "content": "Cras efficitur tempor tincidunt."
            }
        }
    }
}
```

### Code

with `property: value` becomes

```
{
    header:
    {
      property: value,
      ...
    }
}
```

where value is a string, number, or array (if orig value starts with "[")

### Lists

(ordered or otherwise) become

```
{
  header:
  {
    list: [ value, value, ... ],
  }
}
```
