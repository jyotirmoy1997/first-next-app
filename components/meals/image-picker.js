'use client'
import classes from "./image-picker.module.css"
import { useRef, useState } from "react"
import Image from "next/image"

export default function ImagePicker({label, name}){
    const [pickedImage, setPickedImage] = useState(null)
    const imageInputRef = useRef()
    function handlePick(){
        imageInputRef.current.click()
    }
    function handleImageChange(event){
        const file = event.target.files[0];
        if(!file)
            return;

        const fileReader = new FileReader()
        fileReader.onload = () => {
            setPickedImage(fileReader.result)
        }
        fileReader.readAsDataURL(file)
    }
    return(
        <div className={classes.picker}>
            <label htmlFor={name}>{label}</label>
            <div className={classes.controls}>
                <div className={classes.preview}>
                    {!pickedImage && <p>No Image Picked</p>}
                    {
                        pickedImage && 
                        <Image src={pickedImage}
                        alt="Picked Image"
                        fill/>
                    }
                </div>
                <input
                    className={classes.input}
                    type="file"
                    id={name}
                    accept="image/png, image/jpeg"
                    name={name}
                    ref={imageInputRef}
                    onChange={handleImageChange}
                />
                <button className={classes.button}
                    type="button"
                    onClick={handlePick}
                    >Pick an Image</button>
            </div>
        </div>
    )
}