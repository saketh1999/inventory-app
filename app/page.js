'use client'

import { useState,useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, TextField, Typography,Modal,Stack,Button } from "@mui/material";
import { doc, collection, getDoc, getDocs, query, setDoc, updateDoc} from "firebase/firestore";


const HomePage  = ()=>{
    const [inventory,setInventory] = useState([])
    const [open,setOpen] = useState(false)
// Suggested code may be subject to a license. Learn more: ~LicenseLog:3246880164.
    const [itemName,setItemName] = useState('')
    
    async function updateInventory(){
        const snapshot = query(collection(firestore,'inventory'))
        const docs = await getDocs(snapshot)
        const inventoryList = []
        docs.forEach(doc=>{
            inventoryList.push({
                name:doc.id,
                ...doc.data()
            
            })
    })

   setInventory(inventoryList); //Updating the inventory state
    

}
const addItem = async(item)=>{
    const docRef = doc(collection(firestore,'inventory'),item);
    const docSnap =await getDoc(docRef)
    if(docSnap.exists()){
            const {quantity} = docSnap.data()
            await updateDoc(docRef,{quantity:quantity+1})
        
    }
    else{
        await setDoc(docRef,{quantity:1})
    }
    await updateInventory();
}
const handleOpen = () => setOpen(true)
const handleClose = () => setOpen(false)

const removeItem = async(item)=>{
    const docRef = doc(collection(firestore,'inventory'),item);
    const docSnap =await getDoc(docRef)
    if(docSnap.exists()){
       const {quantity} = docSnap.data()
       if(quantity ===1)
        {
            await deleteDoc(docRef)
        }
        else{
            await updateDoc(docRef,{quantity:quantity-1})
        }
        
    }
    await updateInventory();
}
    useEffect(()=>{ //This is a hook that runs when the component is mounted
        updateInventory() //runs only when the page loads
    },[])

    return (
        <Box width="100vw" height="100vh" display="flex" justifyContent="center" flexDirection="column"
        alignItems="center" gap={2}>
            <Modal open={open} >
                <Box
                position = "absolute" top="50%" left="50%"
                transform="translate(-50%,-50%)"
                width={400} bgcolor="white"
                border="2px solid #000"
                boxShadow={24}
                p={4}
                display="flex" flexDirection="column" gap={3}
                >

                    <Typography variant="h3">Add Item</Typography>
                    <Stack width="50%" direction="row" spacing={2}></Stack>
                    <TextField variant="outlined"
                        fullWidth
                        placeholder="Enter Item Name"
                        value = {itemName}
                        onChange={(e)=>{
                            setItemName(e.target.value);
                        }}
                        >

                        </TextField>
                        <Button 
                       
                        variant="contained" onClick={()=>{
                            addItem(itemName);
                            handleClose();
                        }}>Add</Button>
                       
                </Box>
            </Modal>
            
            <Button
            variant="contained"
            onClick={()=>{
                handleOpen()
            }}>
                Add Item
            </Button>

            <Box border="1px solid #333">
                <Box width="800px" height="100px" display="flex"
                bgcolor="#ADD8E6" alignItems="center" justifyContent="center"
                >
                    <Typography variant="h2" color="#333">
                    Inventory Items
                        </Typography>

                </Box>
            </Box>
            <Stack width="800px" height="300px" spacing={2} overflow="auto">
                {
                
                    inventory.map(({name,quantity})=>{

                        <Box key={name} width="100%" minHeight="150px" alignItems = "center" bgColor="#f0f0f0" padding={5}>
                            <Typography
                            variant='h3' color="#333" textAlign="center"
                            >
                                {name.charAt(0).toUpperCase()+name.slice(1)}
                            </Typography>
                            <Typography
                            variant='h3' color="#333" textAlign="center"
                            >
                                {quantity}
                            </Typography>
                            <Button variant="contained" onClick={()=>{
                                removeItem(name)
                            }}></Button>
                        </Box>
                    })
                }

            </Stack>
        </Box>
    )
}
export default HomePage;