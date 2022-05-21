import {NextPage} from "next";
import {Fragment, SyntheticEvent, useEffect, useState} from "react";
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    Col,
    Container,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    Label,
    Row
} from "reactstrap";
import axios from "axios";
import {Router, useRouter} from "next/router";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Oval} from "react-loader-spinner";

const ResetPasswordPage: NextPage = () => {
    const [password, setPassword] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [isErrorPassword, setIsErrorPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState('');
    const router = useRouter();


    useEffect(() => {
        if(!router.isReady) return;
        const {token} = router.query;
        setToken(token + "");
    })


    const handlePassword = (e: any) => {
        setPassword(e.target.value);
        setIsErrorPassword(e.target.value.length < 6);
    }

    const onSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        try{
            setIsLoading(true);
            await axios.patch(`https://nest-prorum.herokuapp.com/api/users/reset-password?token=${token}`, {new_password: password},).then((res) => {
                toast.success('Password successfully changed');
                setIsLoading(false);
                setTimeout(() => {
                    router.push({pathname:'/'});
                }, 5000);
            });
        }catch (err: any){
            toast.error(err.response.data.message);
            setIsLoading(false);
        }
    }

    return <Container>
            <Row className="justify-content-center mt-5">
                <Col sm="6">
                    <Form onSubmit={onSubmit}>
                        <FormGroup>
                            <Label for="password">
                                New Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                placeholder="New Password"
                                title="Password minimum length is 6"
                                type="password"
                                required
                                onChange={handlePassword}
                                invalid={isErrorPassword}/>
                            <FormFeedback>
                                {errorPassword}
                            </FormFeedback>
                        </FormGroup>
                        {!isLoading ?
                            <Button color="primary" outline className="w-100">
                                Save
                            </Button> :
                            <Button
                                disabled={true}
                                className="w-100"
                            >
                                <Oval
                                    height="20"
                                    width="20"
                                    strokeWidth="7"
                                    color='white'
                                    secondaryColor='black'
                                    ariaLabel='loading'
                                    wrapperClass="d-inline-block"
                                />
                            </Button>
                        }

                    </Form>

                </Col>
            </Row>
        <ToastContainer
            position="bottom-right"
            autoClose={5000}
        />
    </Container>
}

export default ResetPasswordPage;