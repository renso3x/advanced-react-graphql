import PleaseSignin from '../components/PleaseSignin';
import CreateItem from '../components/CreateItem';

const sell = () => {
  return (
    <div>
      <PleaseSignin>
        <CreateItem />
      </PleaseSignin>
    </div>
  )
}

export default sell;