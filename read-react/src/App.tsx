import React from "react";
import { throttle } from "lodash";
import { useEffect, useState } from "react";
import "./App.css";
import { fetchBook, fetchStrongsNumbers } from "./utils/api";
import { TBookName, bookList, bookNamesMap, books } from "./utils/books";
import { generateNumbers, later } from "./utils/common";

interface IStrongsNumberDict {
  top: string;
  def: string;
}

function App() {
  const [strongsData, setStrongNumbersData] = useState<
    IStrongsNumberDict[] | null
  >(null);
  const [startingBook, startingChapter, startingVerse] = window.location.hash
    .replace("#", "")
    .split("/");
  const [loading, setLoading] = useState<boolean>(true);
  const [bookData, setBookData] = useState<string[][][][] | null>(null);
  const [book, setBook] = useState<TBookName>(
    startingBook ? (startingBook as TBookName) : "Gen"
  );
  const [selectedWordCode, setSelectedWordCode] = useState<string | null>(null); // [book, chapter, verse, word
  const setChapter = (chapter: number) => {
    window.location.hash = `#${book}/${chapter}/0`;
    // scroll to correct chapter
    const element = document.getElementById(`${book}-${chapter}-0`);
    if (element) {
      element.scrollIntoView();
    }
  };

  // const chapterData = bookData?.[chapter - 1];
  const bookName = bookNamesMap[book].toLowerCase();

  useEffect(() => {
    setLoading(true);

    const asyncFn = async () => {
      const data: string[][][][] = await fetchBook(bookName);
      setBookData(data);
      setLoading(false);

      // on initial load, scroll to correct chapter
      if (!bookData && startingChapter) {
        await later(1);

        const element = document.getElementById(
          `${book}-${startingChapter}-${startingVerse}`
        );
        if (element) {
          element.scrollIntoView();
        }
      }
    };

    asyncFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookName]);

  useEffect(() => {
    fetchStrongsNumbers().then((data: IStrongsNumberDict[]) => {
      setStrongNumbersData(data);
    });
  }, []);

  const chapterCount = +books[book].split(" ")[0];

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bookName = e.target.value as TBookName;
    const asyncFn = async () => {
      await later(1);

      setLoading(true);
      setBook(bookName);
      setChapter(1);
    };

    asyncFn();
  };

  const strongsNumberByCode = strongsData
    ? strongsData.find((item) => {
        return item.top === `H${selectedWordCode}`;
      })
    : null;

  const showStrongNumberDialog =
    !!selectedWordCode && !!strongsNumberByCode?.def;

  useEffect(() => {
    if (showStrongNumberDialog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showStrongNumberDialog]);

  const handleScroll = throttle((): void => {
    let done = false;

    if (bookData) {
      bookData.forEach((chapterData, i) => {
        chapterData.forEach((_verseData, j) => {
          const element = document.getElementById(`${book}-${i + 1}-${j + 1}`);
          if (!done && element) {
            const rect = element.getBoundingClientRect();
            if (rect.top > 0 && rect.top < window.innerHeight) {
              window.location.hash = `#${book}/${i + 1}/${j + 1}`;
              done = true;

              // update chapter selector
              const chapterSelector = document.getElementById(
                "chapterSelector"
              ) as HTMLSelectElement;
              if (chapterSelector) {
                chapterSelector.value = `${i + 1}`;
              }
            }
          }
        });
      });
    }
  }, 2000);

  return (
    <div className="wrapper">
      <div className="header">
        <div className="selectorWrapper">
          <label>Books</label>
          <select
            onChange={handleBookChange}
            defaultValue={startingBook ? startingBook : "Gen"}
          >
            {bookList.map(([key, name]) => (
              <option value={key}>{name}</option>
            ))}
          </select>
        </div>

        <div className="selectorWrapper">
          <label>Chapters</label>
          <select
            onChange={(e) => setChapter(+e.target.value)}
            defaultValue={startingChapter ? startingChapter : 1}
            id="chapterSelector"
          >
            {generateNumbers(chapterCount).map((num) => (
              <option>{num}</option>
            ))}
          </select>
        </div>
      </div>
      <hr />

      <div className="text" onScroll={handleScroll}>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          bookData &&
          bookData.map((chapterData, i) => (
            <div key={"chapter-" + i} className="chapter">
              <div className="chapterNumber" id={`${book}-${i + 1}-0`}>
                Chapter {i + 1}
              </div>
              {chapterData?.map((verse, j) => (
                <span key={"verse-" + j + book} className="verse">
                  <span
                    className="verseNumber"
                    id={`${book}-${i + 1}-${j + 1}`}
                  >
                    {j + 1}
                  </span>
                  {verse.map((word, k) => (
                    <span key={"word-" + j + book + k}>
                      {" "}
                      <Word data={word} onClick={setSelectedWordCode} />
                    </span>
                  ))}
                </span>
              ))}
            </div>
          ))
        )}
      </div>

      {showStrongNumberDialog && (
        <>
          <div className="popoverDialog">
            <span className="close" onClick={() => setSelectedWordCode(null)}>
              Close
            </span>
            <span className="body">
              <span
                dangerouslySetInnerHTML={{
                  __html: strongsNumberByCode.def,
                }}
              ></span>
            </span>
          </div>
          <div
            className="popoverOverlay"
            onClick={() => setSelectedWordCode(null)}
          ></div>
        </>
      )}
    </div>
  );
}
interface IWord {
  data: string[];
  onClick: (word: string) => void;
}

const Word: React.FC<IWord> = ({ data, onClick }) => {
  const [word, code, meaning] = data;
  const handleClick = () => {
    onClick(code);
  };

  if (word.includes("/")) {
    const words = word.split("/");
    const codes = code.split("/");
    const meanings = meaning.split("/");

    const data = words.map((word, i) => [word, codes[i], meanings[i]]);

    return (
      <span className="word-parts">
        {data.map((item, i) => (
          <Word key={"inner-" + item[0] + i} data={item} onClick={onClick} />
        ))}
      </span>
    );
  }

  return (
    <span key={word} className="word" onClick={handleClick}>
      {` ${word} `}
    </span>
  );
};

export default App;
