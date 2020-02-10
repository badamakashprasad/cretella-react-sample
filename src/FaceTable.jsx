import React,{useState,useEffect} from 'react'
import axios from 'axios';


//For Displaying Latest uploaded Date
function getUploadedDate(date){
    date = new Date(date);
    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var uploadedEpoch = date.getTime();
    var time = Math.round(((new Date()).getTime() - uploadedEpoch)/1000);
    if(time < 60){
        return `Uploaded ${time} seconds ago`
    }else if(time < 3600){
        return `Uploaded ${Math.round(time/60)} minutes ago`
    }else if(time < 3600 * 24){
        return `Uploaded ${Math.round(time/3600)} hours ago`
    }else if(time < 3600 * 24 * 7){
        return `Uploaded ${Math.round(time/(3600 * 24))} days ago`
    }else{
        return `Uploaded on ${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`
    }
}

const facetable = document.getElementById('facetable');

export default function FaceTable() {
    const [products,setProducts] = useState([]);
    const [page,setPage] = useState(1);
    const [removed,setRemoved] = useState(false);
    
    const [ads,setAds] = useState();
    useEffect(() => {
        facetable.addEventListener('scroll',infinitescrolling,true);// eslint-disable-next-line
    }, [])



    useEffect(() => {
        axios.get(`http://localhost:3000/products?_page=${page}&_limit=20`).then((response) => {
                setProducts([...products,...response.data])
                if(response.data.every(item => products.includes(item)) || response.data === []){
                    facetable.removeEventListener("scroll",infinitescrolling,true);
                    console.log("removed");
                    setRemoved(true)
                }else{
                    console.log(response.data);
                }
            }).catch(function (error) {
                console.log(error);
              })

            setAds(`http://localhost:3000/ads?r=${page}`);// eslint-disable-next-line
    }, [page])


    //For infinite scrolling 
    const infinitescrolling = ()=>{
        if([1,0,-1].indexOf((facetable.scrollHeight - Math.ceil(facetable.scrollTop)) - facetable.clientHeight) !== -1){
            if(removed === false){
                setPage((page)=>page+1);
                console.log("event listened");
            }else{
                console.log("Already removed");
            }
        }
    }


    
    return (<>
        <img src={ads} alt="ads"/>
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col" >Id</th>
                    <th scope="col" >Size</th>
                    <th scope="col" >Price</th>
                    <th scope="col" >Image</th>
                    <th scope="col" >Date uploaded</th>
                </tr>
            </thead>
            <tbody >
                {products.map((item) =><tr key={item.id}>
                <th scope="row" >{item.id}</th>
                <td >{item.size}</td>
                <td >${`${item.price.toString()[0]}.${item.price.toString().substr(1,2)}`}</td>
                <td >{item.face}</td>
                <td >{getUploadedDate(item.date)}</td>
                </tr>
                )} 
            </tbody>
        </table>
        
        </>
    )
}
