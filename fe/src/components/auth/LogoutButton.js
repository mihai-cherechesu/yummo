import { useAuth0 } from "@auth0/auth0-react"

const LogoutButton = () => {
	const { logout } = useAuth0();
	return (
			<button onClick={() => logout({ returnTo: "http://localhost:3000/sign-up" })}>
					Log Out
			</button>
	);
}

export default LogoutButton;