# Headless UI in React

> 開門見山來說:
> Headless UI 是一種開發元件的概念，核心在於將元件的**功能**與**樣式**徹底分離。

比如一個有客製化需求的下拉式選單(Dropdown)，直覺地我們可能會這樣寫
```js
function MyDropdown(props) {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const handleOnOpenMenu = () => {
    setIsOpenMenu(true);
  }

  const handleOnSelectOption = (option) => {
    props.handleOnSelectOption(option);
    setIsOpenMenu(false);
  }

  return (
    <div className={props.className}>
      <button onClick={handleOnOpenMenu}>Select One</button>
      {isOpenMenu &&
        <div className={props.menuClassName}>
          {props.menus.map(option => (
            <option
              key={option.id}
              className={props.optionClassName}
              onClick={() => handleOnSelectOption(option)}
            >
              {option.text}
            </option>
          ))}
        </div>
      }
    </div>
  );
}
```
這邊只簡單表示了功能與樣式，為了能夠滿足客製化的需求，任何會使用到的功能以及樣式都會透過`props`傳進`MyDropdown`元件，如果樣式更複雜或功能更多一些(比如多選或自動選擇)，這樣一個元件就會變得無比複雜。
以往為了解決這樣的架構問題，會試圖將**樣式**的部分抽離出來變成另一個元件，同時將部分功能提取出來，盡可能讓原本的原件保持乾淨的結構。這麼做或許可以讓元件更加乾淨，但其實這對可維護性並無太大幫助。
一個元件的樣式與功能全分散出去，當中有些無法脫鉤的邏輯會使得提高維護成本(抽象化的過程不難，但看得懂的抽象結果是不容易做到的)。既然我們都知道，將**功能**與**樣式**抽離出來維護是必要之舉，那何不一開始就讓**功能**與**樣式**分離。

首先我們會需要將**樣式**與**功能**整理出來，這裡我們有2個功能:
1. 開關選單
2. 選擇選項並關閉選單

樣式的部分有:
1. 開啟選單的按鈕
2. 選單容器
3. 選項

針對功能，我們可以這樣寫
```js
function MyDropdown(props) {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const handleOnOpenMenu = () => {
    setIsOpenMenu(true);
  }

  const handleOnSelectOption = (option) => {
    props.handleOnSelectOption(option);
    setIsOpenMenu(false);
  }

  return (
    <>{props.children(isOpenMenu, handleOnOpenMenu, handleOnSelectOption)}</>
  );
}
```
透過`render props`的方式將我們會用到的功能回傳出來使用
```js
<MyDropdown>
  {(isOpenMenu, handleOnOpenMenu, handleOnSelectOption) => (
    {/* 開啟選單的按鈕 */}
    {/* 選單容器 */}
    {/* 選項 */}
  )}
</MyDropdown>
```
如此一來，樣式的部分就不再需要當作參數傳進元件裡，且選單的結構是高度客製化的，想要不同樣式的下拉式選單都可以輕易地實作出來，而無需考量到**功能**層面的事情。
同樣的，當有不同的功能需求時，也不用遷就於樣式的呈現或結構，而能專注於功能的實現。

不過，缺點就是抽象化的結果勢必會造成閱讀性降低，且`render props`其實並不好看。過度的抽離反而造成多寫了很多程式碼。
> 所以我個人是依照需求以及可能再調整的部分來決定要抽離多少內容，比如對我來說一個下拉式選單的按鈕樣式不會變，而且選單容器的開關直接與按鈕有關，此時我會傾向於將按鈕與選單容器寫在有**功能**那個元件裡。
> 另外，如果需要回傳的資訊過多，我也會透過`Context`來共享，如此一來程式的介面會更加簡潔。
