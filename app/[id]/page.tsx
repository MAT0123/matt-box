"use client"
import React, { useEffect, useState } from 'react'

export default function DownloadFile({params}: {params: Promise<{ id: string}>}) {
    const [id , setId ] = useState("")
    const takeParams = () => {
        params.then((e) => {
            setId(e.id)
        })
    }
//     const handleDownload = () => {
//   const id = params.id
//   const request = new XMLHttpRequest()
//   request.open("GET", `https://wqc8yzxgu7.execute-api.us-east-2.amazonaws.com/prod/?id=${id}`)
//   request.responseType = "arraybuffer"
//   request.onload = () => {
//     const response = request.response
//     const contentType = request.getResponseHeader("Content-Type")
//     const blob = new Blob([response] , { type : contentType || "application/octet-stream"})
//     const downloadA = document.createElement('a')
//     const localURL = URL.createObjectURL(blob)

//     downloadA.href = localURL
//     downloadA.download = id // 👈 forces download instead of opening in tab
//     downloadA.style.display = "none"
//     document.body.appendChild(downloadA)
//     downloadA.click()
//   }
//   request.send()
// }

    useEffect(() => {
       takeParams()
       console.log(id)
        const previewImage = () => {
            const downloadA = document.createElement('a')
            downloadA.href = `https://d2w9ks2xmlai7k.cloudfront.net/${id}`
            downloadA.style.display = "none"
            document.body.appendChild(downloadA)
            downloadA.target = "_blank"
            downloadA.click()
        }
        const handleDownload = () => {
        const request = new XMLHttpRequest()
        request.open("GET" , `https://jieycntrxe.execute-api.us-east-2.amazonaws.com/prod/?id=${id}`)
        request.onload = (e) => {
            const response = request.response
            const contentType = request.getResponseHeader("Content-Type") || "application/octet-stream"
            console.log(response)
        //    const base642 = Buffer.from(base64 , "base64").toString("utf-8")

        //     const base643 = Buffer.from(base642 , "base64").toString("utf-8")


  

            const binToString = atob(response)
            const data = new Uint8Array(binToString.length)
            for(let i = 0 ; i < binToString.length  ; i++){
                data[i] = binToString.charCodeAt(i)
            }
             const blob = new Blob([data] , { type: contentType})

            const extension = contentType.includes('image/jpeg') ? '.jpg' :
                            contentType.includes('image/png') ? '.png' :
                            contentType.includes('image/gif') ? '.gif' :
                            contentType.includes('image/webp') ? '.webp' :
                            contentType.includes('image/svg') ? '.svg' :
                            contentType.includes('application/pdf') ? '.pdf' : ''
            const localURL = URL.createObjectURL(blob)
            const downloadA = document.createElement('a')
            downloadA.href = localURL
            downloadA.style.display = "none"
            downloadA.download = `Mattbox.${extension}`
            document.body.appendChild(downloadA)
            
            downloadA.click()
        }
        request.send()

        
    }
        
         if (id) {
                  previewImage()

      handleDownload()
    }
    } , [params , id , takeParams])
  return (
    <div>
        {
            !id && "Please provide key"
        }
    </div>
  )
}

