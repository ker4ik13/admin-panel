"use client";
import { AuthService } from "@/services/auth.service";
import { IError } from "@/shared/types/IError";
import { LoginUserDto } from "@/shared/types/user/LoginUser.dto";
import { SubmitButton } from "@/shared/ui/SubmitButton";
import { showNotification } from "@/widgets/Notification/utils/showNotification";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import s from "./LoginPage.module.scss";

const LoginPage = () => {
  const [errors, setErrors] = useState<IError[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();

  const onSubmit = async (values: LoginUserDto) => {
    setLoading(true);
    setErrors([]);
    const response = await AuthService.login(values);

    if (response.status === 201) {
      showNotification(`Успешный вход`, {
        type: "success",
        autoClose: 2000,
      });
      setLoading(false);
      router.push("/admin/dashboard");
      return;
    }

    if (response.status !== 201) {
      const errors: IError[] = [];
      setLoading(false);

      const responseJson = await response.json();

      responseJson.message.map((error: string) => {
        errors.push({
          isError: true,
          text: error,
        });
      });

      setErrors(errors);
    }
  };

  return (
    <div className={s.page}>
      {errors.map((error) => (
        <p className="error_text" key={error.text}>
          {error.text}
        </p>
      ))}
      <Form
        form={form}
        name="basic"
        className={s.form}
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onSubmit}
      >
        <Form.Item<LoginUserDto>
          label="Почта"
          name="email"
          tooltip="Почта, которую вы заполняли при регистрации"
          hasFeedback
          validateDebounce={700}
          rules={[
            { required: true, message: "Поле обязательно" },
            { type: "email", message: "Введите почту" },
          ]}
        >
          <Input
            autoComplete="email"
            placeholder="youremail@gmail.com"
            prefix={<MailOutlined />}
          />
        </Form.Item>

        <Form.Item<LoginUserDto>
          label="Пароль"
          name="password"
          validateDebounce={700}
          hasFeedback
          rules={[
            { required: true, message: "Поле обязательно" },
            { min: 8, message: "Пароль должен быть не меньше 8 символов" },
          ]}
        >
          <Input.Password
            autoComplete="password"
            minLength={8}
            prefix={<LockOutlined />}
          />
        </Form.Item>

        <Link className={s.link} href={"/admin/auth/registration"}>
          Нет аккаунта? Создать
        </Link>

        <Form.Item className={s.buttonWrapper}>
          <SubmitButton
            className={s.button}
            onSubmit={onSubmit}
            form={form}
            loading={loading}
          >
            Войти
          </SubmitButton>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
