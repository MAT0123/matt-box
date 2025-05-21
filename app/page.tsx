"use client"
import Image from "next/image";
import { FolderUp , Download } from 'lucide-react';
import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { randomUUID } from "crypto";
import { buffer } from "stream/consumers";
import { Progress } from "@/components/ui/progress";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/navigation";


function DropBox({ onChangeUp , onDrag , onDragEnter , onDragLeave , onDrop}: {onChangeUp: (e:React.ChangeEvent<HTMLInputElement>) => void , onDrag: React.ComponentState , onDragEnter:React.DragEventHandler , onDragLeave: React.DragEventHandler  , onDrop: React.DragEventHandler}){
  const ref = useRef<HTMLInputElement>(null)
 
  return (
  <div className={onDrag ? "bg-blue-300 w-[400px] h-[200px] rounded-lg flex items-center justify-center mx-auto" : "bg-gray-300 w-[400px] h-[200px] rounded-lg flex items-center justify-center mx-auto"} onClick={() => {
    ref.current?.click()
  }} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop} onDragOver={(e) => {e.preventDefault()}}>
    <div className="flex flex-col items-center" onDragEnter={(e) => {
      onDragEnter(e)
    }} onDragLeave={(e) => {
      onDragLeave(e)
    }} onDrop={(e) => {
      onDrop(e)
    }}>
      <input type="file" className="hidden" id="fileInput" onChange={onChangeUp} ref={ref}  accept="*"  />
      <FolderUp size={40}/>
      <div className="mt-4">
         <span className="text-gray-600 font-bold block text-center">Drag and drop your files here</span>
      <span className="text-gray-600 font-bold block text-center">or click to upload</span>
      </div>
     
    </div>
  </div>)
}
 function DownloadComponent() {
  const [id , setId] = useState("")
  const router = useRouter()
  function goToDownloadPage(){
    router.push(`/${id}`)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Download File</h2>
      
      <div className="flex gap-3">
        <input 
          type="search" 
          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900" 
          placeholder="Enter Download ID"
          value={id}
          onChange={(e) => {
            console.log(e.target.value)
              setId(e.target.value)
              console.log("id value is", id)

          }}
        
        />
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow-md" onClick={() => {

          if(id != ""){
               goToDownloadPage()
          }else{
            toast("Please enter an id")
          }
        }}>
          <Download size={18} />
          Download
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mt-3">
        Enter your download ID to retrieve your file
      </p>
    </div>
  );
}
export default function Home() {
  const [isDragging , setIsDragging] = useState(false)
  const [uploadState , setUploadState] = useState(0)
  const [isReady , setisReady] = useState(false)

  const notify = (message:string) => toast(message);

 const [fileBuffer, setFileBuffer] = useState("");
const [fileName, setFileName] = useState("");
const [contentType, setContentType] = useState("");
  function readFileToBase64(file:File){
    return new Promise((resolve ,reject) => {
        const fileReader = new FileReader()
    fileReader.onload = () => {
      const base64 = fileReader.result?.toString().split(',')[1]
      console.log(base64)
      resolve(base64)

    }
    fileReader.onerror = (e) => {
      reject(e)
    }
    fileReader.readAsDataURL(file)
    })
  
  }

  const handleFileChange =  (e:React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const file = e.target.files?.item(0)
    const maxMB = 10
    const oneMb =  1024 * 1024
    if(file && file?.size > (maxMB * oneMb)){
        notify("I'm going to go bankrupt bro , 10 MB max")
      return
    }
    notify("Loading data... , please wait")
    if(file){
      setFileName(file.name)
      setContentType(file.type)
      
      readFileToBase64(file).then((base64) => {

        if(typeof base64 == "string"){
              setFileBuffer(base64)
              setisReady(true)
              console.log(fileBuffer)
              notify("Data loaded")

        }
      }).catch((e) => {
        console.log(e)
      })
    }
  }
  const onDragEnter = (e:React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
      e.stopPropagation()
          console.log("Enter")

    setIsDragging(true)    
  }
   const onDragLeave =  (e:React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
        e.stopPropagation()
    console.log("Leave")
    if(e.target === e.currentTarget){
            setIsDragging(false)    

    }
  }
  const onDrop =  async (e:React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
        console.log("Drop")

    e.stopPropagation()
    
    setIsDragging(false)
    if(e.dataTransfer.files){
      const data = e.dataTransfer.files.item(0)
       const maxMB = 10
    const oneMb =  1024 * 1024
          setContentType( data?.type || "application/octet-stream")

       if(data && data?.size > (maxMB * oneMb)){
        notify("I'm going to go bankrupt bro , 10 MB max")
      return
    }

        if(data){
          
                   readFileToBase64(data).then((base64) => {
          if(typeof base64 == "string"){
              setFileBuffer(base64)
              setisReady(true)
              
        }
      }).catch((e) => {
        console.log(e)
      })
        }

          console.log(fileBuffer)
    }
  }
  const handleUpload = async () => {
  if(fileBuffer){
   const body = {
      "content" : fileBuffer,
      "contentType": contentType
    }
      const randomId =  crypto.randomUUID()

    const xmlHttpUpload = new XMLHttpRequest()
        xmlHttpUpload.open("POST" , ` https://1r2o5wfz44.execute-api.us-east-2.amazonaws.com/prod/?id=${randomId}`)
    xmlHttpUpload.upload.onprogress = (e) => {
      setUploadState(Math.round(e.loaded / e.total * 100) )
      if(e.loaded == e.total){
        toast(`Uploaded , Your file is is ${randomId}` , {
            
            duration: 5000
        })
        
      }
      console.log(uploadState)
    }
    xmlHttpUpload.onload = (e) => {
      console.log(xmlHttpUpload.response)
      
    }
    xmlHttpUpload.onloadend = (e) => {
      setisReady(false)
    }
    xmlHttpUpload.setRequestHeader("Content-Type" , "application/json")
    xmlHttpUpload.send(JSON.stringify(body))
  }else{
    notify("Loading file , please wait")
  }
  }
  return (
    <div className="bg-gray-200 h-screen flex">
      <Toaster />
      <div className="max-w-[700px] mx-auto my-auto items-center space-y-2">
        <DownloadComponent/>
        <div className="bg-white  p-8 rounded-lg shadow-lg">
        <h2 className="text-black font-bold text-[35px] text-center">Matt's Box</h2>
        <div className="">
          <DropBox onChangeUp={handleFileChange} onDrag={isDragging} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop}/>

        </div >
        <button className={isReady ? "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mx-auto block mt-4" : "px-4 py-2 bg-gray-600 text-white rounded  mx-auto block mt-4"} onClick={handleUpload} disabled={isReady == false ? true : false} >Upload Anonymously</button>
        <div className="mt-4 text-gray-600 font-bold">
          <span className="block text-center">This upload service is available only for anonymous users.</span>
          <span className="block text-center">
            Files will be available for 24 hours. Maximum file size: 50MB
          </span>
        </div>
        <Progress value={uploadState} className={uploadState <= 0 ? `hidden bg-green-200` : "bg-green-200"}/>
      </div>
      </div>
      
    </div>
  );
}
