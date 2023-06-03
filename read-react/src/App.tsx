import { useEffect, useState } from "react";
import "./App.css";
import { fetchBook } from "./utils/api";
import { bookNames } from "./utils/books";

function App() {
  const book = "Gen";
  const chapter = 1;
  const verse = 1;
  const bookName = bookNames[book].toLowerCase();

  const [data, setData] = useState<string[][] | null>(null);

  useEffect(() => {
    fetchBook(bookName).then((data: string[][][]) => {
      console.log(data[chapter - 1]);
      setData(data[chapter - 1]);
    });
  }, []);

  return (
    <>
      {data?.map((verse) => (
        <span>
          {verse.map((word) => {
            return <span> {word[0]}</span>;
          })}
        </span>
      ))}
    </>
  );
}

export default App;
