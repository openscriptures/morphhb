import { useEffect, useState } from "react";
import "./App.css";
import { fetchBook } from "./utils/api";
import { TBookName, bookList, bookNamesMap, books } from "./utils/books";
import { generateNumbers } from "./utils/common";

function App() {
  const [data, setData] = useState<string[][] | null>(null);
  const [book, setBook] = useState<TBookName>("Gen");
  const [chapter, setChapter] = useState(1);

  const bookName = bookNamesMap[book].toLowerCase();

  useEffect(() => {
    fetchBook(bookName).then((data: string[][][]) => {
      console.log(data[chapter - 1]);
      setData(data[chapter - 1]);
    });
  }, [bookName, chapter]);

  const chapterCount = +books[book].split(" ")[0];

  return (
    <div className="wrapper">
      <div className="header">
        <div className="selectorWrapper">
          <label>Books</label>
          <select
            onChange={(e) => {
              if (book !== e.target.value) setChapter(1);
              setBook(e.target.value as TBookName);
            }}
          >
            {bookList.map(([key, name]) => (
              <option value={key}>{name}</option>
            ))}
          </select>
        </div>

        <div className="selectorWrapper">
          <label>Chapters</label>
          <select onChange={(e) => setChapter(+e.target.value)}>
            {generateNumbers(chapterCount).map((num) => (
              <option>{num}</option>
            ))}
          </select>
        </div>
      </div>
      <hr />

      <div className="text">
        {data?.map((verse) => (
          <span>
            {verse.map((word) => {
              return <span> {word[0]}</span>;
            })}
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;
