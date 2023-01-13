
import Editor from "@monaco-editor/react";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { Config } from "../config/config";
import FileOpen from "./fileOpen";
import "./index.css";
export function Myeditor() {
    const [fileUrl, setFileUrl] = useState([]);
    const [displayList, setDisplayList] = useState([]);
    const [fileContent, setFileContent] = useState('');
    const [changeString, setChangeString] = useState('');
    const [offSetNum, setOffSetNum] = useState(0);
    const [changeCounts, setChangeCounts] = useState(0);
    const [startLines, setStartLines] = useState(1);
    const [startColumns, setStartColumns] = useState(1);
    const [endLines, setEndLines] = useState(1);
    const [endColumns, setEndColumns] = useState(1);
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
    const [vars, setVars] = useState({});
    const { monacoEditor, monaco } = vars;
    let config = Config;
    const [count, setCount ] = useState(1);
    const timerRef = useRef();
    async function editorDidMount(monacoEditor, monaco) {
        setVars({ monacoEditor, monaco });
    }

    useEffect(() => {
        const displayList = giveListLog.map(item => Object.assign(item, {show: false}))
        setDisplayList(displayList);
    }, [changeString])

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setCount(c => c + 1);
        }, 1000);
        return () => {
            clearInterval(timerRef.current);
        };
    }, [ timerRef, setCount ]);

    useEffect(()=>{
        let tempGive = [];
        if(tempgivestring[0].string !== changeString){
            if (count % 10 === 0 ) {
                tempGive = [
                    {
                        'date': new Date().toLocaleString(),
                        'string': changeString,
                        'offSetNum': offSetNum,
                    },
                ];
                console.log('tempGive', tempGive);
                setTempgivestring(tempGive);
                setGiveListLog([...giveListLog, ...tempGive]);
                const obj = [...giveListLog, ...tempGive];
                const blob = new Blob([JSON.stringify(obj, null, 2)], {type : 'application/json'});
                saveFile(blob, fileUrl);
            }  
        }
    }, [count])

    useEffect(() => {
        if (!monacoEditor || !monaco) {
          return;
        }
        const qwe = monacoEditor.deltaDecorations(
          [], [{ range: new monaco.Range(startLines, startColumns, endLines, endColumns), options: { inlineClassName: "base.case.rofl" }}]  
        );
        return () => monacoEditor.deltaDecorations(qwe, []);
    }, [changeString]);   

    const handleClickInfo = (selectedIndex) => {
        const newDisplayList = displayList.map((item, index) => {
            if(index === selectedIndex) item.show = !(item.show);
            return item;
        });
        setDisplayList(newDisplayList);
    }

    const handleEditorChange = (count, event) => {
        let a=changeCounts;
        setChangeCounts(a++);
        let temp1 = '';
        temp1 = changeString +  event.changes[0].text;
        setChangeString(temp1);
        setOffSetNum(parseInt(event.changes[0].rangeOffset));
        setEndLines(event.changes[0].range.startLineNumber);
        setEndColumns(event.changes[0].range.startColumn);
        if (count % 5 === 0 && tempgivestring[0].string !== changeString) {
            setStartLines(event.changes[0].range.startLineNumber);
            setStartColumns(event.changes[0].range.startColumn);
        }    
    }

    const saveFile = async (blob, fileUrl) => {
        const a = document.createElement('a');
        a.download = fileUrl.name;
        a.href = URL.createObjectURL(blob);
        a.addEventListener('click', (e) => {
          setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
        });
        a.click();
    }
    return (
        <div className="w-full flex justify-center flex-col mt-5  rounded border-b-1 border-[#451356] ">
            <div className="w-full text-4xl font-bold text-[#451356] h-12 text-center">{config.title}</div>
            <div className="w-full">
                <FileOpen setTempgivestring={setTempgivestring} setFileContent={setFileContent} setFileUrl={setFileUrl}/>
            </div>
            <div className="w-full flex flex-row border ">
                <div className="w-2/3 border-spacing-1 border-[#000000] ">                    
                <EditorWrapper
                    path={fileUrl.name} defaultLanguage={fileUrl.type} value={fileContent} handleEditorChange={handleEditorChange} editorDidMount={editorDidMount}/>  
                </div>
                <div className="w-1/3  bg-[#D9E8F5]  " >
                    <div className='flex-col p-5'>
                        <p className='text-2xl font-bold'>Tracked Changes</p>
                        
                        <div className='border-spacing-1 '>
                            
                            <div className='h-auto'>
                                {giveListLog && giveListLog.map((item, index) =>(
                                    <div key = {index} className='border rounded-xl shadow-slate-700 border-b-indigo-400'>
                                        <p className='text-xl font-medium'>Tracked Changes:{changeCounts}</p>
                                        <p className='text-mm pl-5 hover:text-lime-800 cursor-pointer' onClick={() => handleClickInfo(index)}>{item.show ? item.string : item.string.slice(0, 5)+'...'}</p>
                                        <p className="text-sm  pl-5">{item.offSetNum}</p>
                                        <p className="text-sm pl-5">{item.date}</p>
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
function EditorWrapper({ theme, path,defaultLanguage,value, language, editorDidMount, handleEditorChange }) {
    return (
        <Editor
            height="80vh"
            theme={theme}
            path={path}
            defaultLanguage={defaultLanguage}
            value={value}
            onMount={editorDidMount}
            onChange={handleEditorChange} /> 
    );
}
