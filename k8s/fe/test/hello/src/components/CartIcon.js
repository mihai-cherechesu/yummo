
const CartIcon = (count) => {
  if (count.count > 0) {
    return (
      <span className="fa-stack fa-1x has-badge cart-test" data-count={count.count}>
        <i className="fa fa-circle fa-stack-2x" style={{color: '#37ABC8'}}></i>
        <i className="fa fa-shopping-cart fa-stack-1x fa-inverse"></i>
      </span>
    )
  }

  return (
    <span className="fa-stack fa-1x has-badge cart-test">
      <i className="fa fa-circle fa-stack-2x" style={{color: '#faa604'}}></i>
      <i className="fa fa-shopping-cart fa-stack-1x fa-inverse"></i>
    </span>
  )
}

export default CartIcon;