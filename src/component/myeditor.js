import Editor, { monaco,useMonaco } from "@monaco-editor/react";
// import files from "./files";
import React, { useState,useCallback, useEffect, useRef } from "react";
import { Config } from "../config/config";
import FileOpen from "./fileOpen";
export function Myeditor() {
    async function handleEditorDidMount(monacoEditor, monaco) {
        setVars({ monacoEditor, monaco });
      }
    const [fileUrl, setFileUrl] = useState([]);
    const [displayList, setDisplayList] = useState([]);
    const [fileContent, setFileContent] = useState('');
    const [changeString, setChangeString] = useState('');
    const [offSetNum, setOffSetNum] = useState(0);
    const [vars, setVars] = useState({});
    const [ids, setIds] = useState([]);
    const { monacoEditor, monaco } = vars;
    const [changeCounts, setChangeCounts] = useState(0);
    const [giveListLog, setGiveListLog] = useState([
        {
        'string': '',
        'date': '',
        'offSetNum': 0,
        }
    ]);
    const [tempgivestring, setTempgivestring] = useState([
        {
        'string': '',
        'date': '',
        'offSetNum': 0,
        }
    ]);
    const handleChangeIds = useCallback(() => {
        if (!monacoEditor || !monaco) {
          return;
        }
        setIds((ids) => {
          const newIds = monacoEditor.deltaDecorations(ids, [
            {
              range: new monaco.Range(1, 1, 1, 5),
              options: { inlineClassName: "base.case.lol" }
            }
          ]);
          return newIds;
        });
        
      }, [monacoEditor, monaco]);
    let config = Config;
    let temp = '';
    const [ count, setCount ] = useState(0);
    const timerRef = useRef();
    useEffect(() => {
        const displayList = giveListLog.map(item => Object.assign(item, {show: false}))
        setDisplayList(displayList);
    }, [changeString])

    
    // This executes once upon mounting
    // i.e. equivalent to componentDidMount() in a class component
    useEffect(() => {
        // Register a function to increment the count every second
        // and capture the timer handle so we can cancel it later.
        timerRef.current = setInterval(() => {
            setCount(c => c + 1);
        }, 1000);
        // Clean up when the component is unmounting
        // i.e. equivalent to componentWillUnmount() in a class
        
        return () => {
            clearInterval(timerRef.current);
        };
    }, [ timerRef, setCount ]);
    // 
    useEffect(()=>{
        let tempGive = [];
        // setTimeout(() => {
            
        // }, 1000);
        if (count % 5 == 0) {
            if(tempgivestring[0].string !== changeString){
                tempGive = [
                    {
                        'date': new Date().toLocaleString(),
                        'string': changeString,
                        'offSetNum': offSetNum,
                    },
                ];
                setGiveListLog([...giveListLog, ...tempGive]);
                setTempgivestring(tempGive);
                console.log('givestringlgo.string', tempgivestring[0].string);
                console.log('changestring', changeString);
            }  
            console.log('givelistlog', giveListLog);
        }  
    }, [count])
    const handleClickInfo = (selectedIndex) => {
        console.log('givelistlog');
        const newDisplayList = displayList.map((item, index) => {
            if(index === selectedIndex) item.show = !(item.show);
            return item;
        });
        setDisplayList(newDisplayList);
    }
    const handleEditorChange = (value, event) => {
        // event.getValue();
        let a=changeCounts;
        setChangeCounts(a++);
        let temp1 = '';
        temp1 = changeString +  event.changes[0].text;
        setChangeString(temp1);
        setOffSetNum(parseInt(event.changes[0].rangeOffset));
      }
    return (
        <div className="w-full flex justify-center flex-col mt-5  rounded border-b-1 border-[#451356] ">
            <div className="w-full text-4xl font-bold text-[#451356] h-12 text-center">{config.title}</div>
            <div className="w-full">
                <FileOpen setFileContent={setFileContent} setFileUrl = {setFileUrl} setTempgivestring = {setTempgivestring}/>
            </div>
            <div className="w-full flex flex-row border ">
                <div className="w-2/3 border-spacing-1 border-[#000000] ">
                    
                    <Editor
                        height="60vh"
                        path={fileUrl.name}
                        defaultLanguage={fileUrl.type}
                        value={fileContent}
                        onChange={handleEditorChange}
                    /> 
                </div>
                <div className="w-1/3  bg-[#D9E8F5]  " >
                    <div className='flex-col p-2'>
                        <p className='text-2xl'>Tracked Changes</p>
                        
                        <div className=' object-none object-center'>
                            <div className='h-auto'>
                                {giveListLog && giveListLog.map((item, index) =>(
                                    <div key = {index} className='border border-spacing-1 border-b-indigo-400'>
                                        <p className=' text-xl  '>{index+1}.Tracked Changes</p>
                                        <p className='text-mm border border-spacing-1 border-b-indigo-200 cursor-pointer' onClick={() => handleClickInfo(index)}>{item.show ? item.string : item.string.slice(0, 5)+'...'}</p>
                                        <p className="text-sm  ">Tracked Number:{item.offSetNum}</p>
                                        <p className="text-sm ">Tracked Date:{item.date}</p>
                                    </div>
                                ))}   
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
       
    )
}