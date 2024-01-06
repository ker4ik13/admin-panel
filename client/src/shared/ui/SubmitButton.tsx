import { Button, Form, FormInstance } from "antd";
import { ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
  onSubmit: (...props: any) => void;
  form: FormInstance;
  className?: string;
  loading?: boolean;
}

export const SubmitButton = ({
  form,
  onSubmit,
  children,
  className,
  loading,
}: Props) => {
  const [submittable, setSubmittable] = useState(false);
  const values = Form.useWatch([], form);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      }
    );
  }, [values]);

  return (
    <Button
      type="primary"
      htmlType="submit"
      disabled={!submittable}
      onSubmit={onSubmit}
      className={className ? className : ""}
      loading={loading}
    >
      {children}
    </Button>
  );
};
