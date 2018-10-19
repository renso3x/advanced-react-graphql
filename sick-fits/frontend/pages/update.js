import UpdateItem from '../components/UpdateItem';

const sell = (props) => {
  return (
    <div>
      <UpdateItem id={props.query.id} />
    </div>
  )
}

export default sell;