import AuthLayout from "../components/auth/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import AuthHeader from "../components/auth/AuthHeader";
import LoginForm from "../components/auth/LoginForm";
import SocialLoginButtons from "../components/auth/SocialLoginButtons";
import AuthFooter from "../components/auth/AuthFooter";

const Login = () => {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader />
        <LoginForm />
        <SocialLoginButtons />
        <AuthFooter />
      </AuthCard>
    </AuthLayout>
  );
};

export default Login;