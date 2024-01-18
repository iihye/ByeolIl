import FollowList from './components/user/FollowList';
import { RecoilRoot } from 'recoil';

function App() {
    return (
        <div className="App">
            <RecoilRoot>
                <FollowList />
            </RecoilRoot>
        </div>
    );
}

export default App;
