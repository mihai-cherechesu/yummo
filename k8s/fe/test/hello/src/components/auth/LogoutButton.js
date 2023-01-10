import { useAuth0 } from "@auth0/auth0-react"

const LogoutButton = () => {
	const { logout } = useAuth0();
	return (
			<button onClick={() => logout({ returnTo: "https://a385e3b6d9ba543b79fdf9b46ae600f1-1114754256.eu-central-1.elb.amazonaws.com/nginx-fe/sign-up" })}>
					Log Out
			</button>
	);
}

export default LogoutButton;