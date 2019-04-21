import React from 'react'
import Axios from 'axios';
import { urlApi } from '../support/urlApi';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import {cartCount} from './../1.actions'


class ProductDetail extends React.Component{
    state = {product : {}}
    componentDidMount(){
        this.getDataApi()
    }

    getDataApi = () => {
        var idUrl = this.props.match.params.id // id harus sesuai dengan yg ada di app.js yg di route product-detail
        Axios.get(urlApi + '/product/product-detail/' + idUrl)
        .then((res) => {
            this.setState({product : res.data[0]})
        })
        .catch((err) => console.log(err))
    }

    proteksiQty = () => {
        var qty = this.refs.inputQty.value
        if(qty < 1){
            this.refs.inputQty.value = 1
        }
    }

    addBtnCart = () => {
        var newData = {
            idUser : this.props.id,
            discount : this.state.product.discount,
            nama : this.state.product.nama,
            harga : this.state.product.harga,
            qty : this.refs.inputQty.value,
        }
        Axios.get(urlApi + '/cart?nama=' + this.state.product.nama + '&idUser=' + this.props.id).then((res) => {
            if(res.data.length > 0){
                Axios.put(urlApi + '/cart/' + res.data[0].id, {...newData, qty: parseInt(res.data[0].qty) + parseInt(this.refs.inputQty.value) })
                swal('Status Add' , 'Success Add to Cart' , 'success')
            }else{
                Axios.post(urlApi + '/cart',newData)
                .then((res) => {
                    swal('Status Add' , 'Success Add to Cart' , 'success')
                    this.props.cartCount(this.props.username)
                })
                .catch((err) => console.log(err))
            }
        })

    }

    addBtnWish = () => {
        var newData = {
            idUser : this.props.id,
            discount : this.state.product.discount,
            nama : this.state.product.nama,
            harga : this.state.product.harga,
            deskripsi : this.state.product.deskripsi,
            qty : 1,
        }
        Axios.get(urlApi + '/wishlist?nama=' + this.state.product.nama + '&idUser=' + this.props.id).then((res) => {
            if(res.data.length > 0){
                Axios.put(urlApi + '/wishlist/' + res.data[0].id, {...newData, qty: parseInt(res.data[0].qty) + parseInt(this.refs.inputQty.value) })
                swal('Status Add' , 'Success Add to Wishlist' , 'success')
            }else{
                Axios.post(urlApi + '/wishlist',newData)
                .then((res) => {
                    swal('Status Add' , 'Success Add to Wishlist' , 'success')
                    // this.props.cartCount(this.props.username)
                })
                .catch((err) => console.log(err))
            }
        })


    }

    render(){
        var{nama_product,harga_product,discount_product,image,deskripsi_product} = this.state.product
        return(
            <div className='container' style={{paddingTop:'150px'}}>
                <div  className='row'>
                    <div className='col-md-4'>
                        <div className="card" style={{width: '100%'}}>
                            <img src={`http://localhost:2008/${image}`} className="card-img-top" alt="Card cap" />
                            <div className="card-body">
                            <p className="card-text"></p>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-8'>
                        <h1 style={{color:'#4C4C4C'}}>{nama_product}</h1>
                        <div style={{backgroundColor:'#D50000',width:'50px',height:'20px',color:'white',textAlign:'center',fontWeight:'bold',display:'inline-block'}}>
                            {discount_product}%
                        </div>
                        <span style={{fontWeight:'600',fontSize:'15px',color:'#606060',marginLeft:'10px',textDecoration:'line-through'}}> Rp. {harga_product}</span>
                        <div style={{fontWeight:'700',fontSize:'24px',color:'#FF5722',marginTop:'20px'}}>Rp. {harga_product-(harga_product*(discount_product/100))}</div>

                        <div className='row'>
                            <div className='col-md-2'>
                                <div style={{marginTop:'20px',color:'#606060',fontWeight:'700',fontSize:'14px'}}>Jumlah</div>
                                <input type='number' ref='inputQty' onChange={this.proteksiQty} min={1} className='form-control' style={{width:'60px',marginTop:'10px'}}></input>
                            </div>
                            <div className='col-md-6'>
                                <div style={{marginTop:'20px',color:'#606060',fontWeight:'700',fontSize:'14px'}}>Catatan Untuk Penjual (Optional)</div>
                                <input type='text' placeholder='Ex : Contoh Warna Putih, Ukuran XL, Edisi ke-2'className='form-control' style={{width:'100%',marginTop:'10px'}}></input>   
                            </div>
                        </div>
                        <div className='row mt-4'>
                            <div className='col-md-8'>
                                <p style={{color:'#606060',fontStyle:'italic'}}>{deskripsi_product}</p>
                            </div>
                        </div>
                        {
                            this.props.username === '' ?
                        <div className='row mt-4'>
                            <input type='button' className='btn border-secondary col-md-2 ml-3' disabled value='Add To Wishlist'></input>
                            <input type='button' className='btn btn-primary col-md-2 ml-3' disabled value='Beli Sekarang'></input>
                            <input type='button' className='btn btn-success col-md-3 ml-3' disabled value='Masukkan Ke Keranjang'></input>
                        </div>
                         :
                         <div className='row mt-4'>
                         <input type='button' className='btn border-secondary col-md-2 ml-3' value='Add To Wishlist' onClick={this.addBtnWish}></input>
                         <input type='button' className='btn btn-primary col-md-2 ml-3' value='Beli Sekarang'></input>
                         <input type='button' className='btn btn-success col-md-3 ml-3' value='Add To Cart' onClick={this.addBtnCart}></input>
                     </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
      username : state.user.username,
      id : state.user.id,
      cart : state.cart.count
    }
  }

export default connect (mapStateToProps,{cartCount})(ProductDetail);