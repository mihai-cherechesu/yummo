import { FooterContainer } from './FooterContainer';
import './Loading.css'
import NavBar from './NavBar';

const Loading = () => {
	return (
		<div className="container">
			<div className="Contact">
				<FooterContainer />
			</div>
			<div className="Profile-Navbar">
				<NavBar />
			</div>
			<div className="Loading">
				<div className="loader-wrapper">
					<span className="loader"><span className="loader-inner"></span></span>
				</div>
			</div>
		</div>
	);
}

export default Loading;