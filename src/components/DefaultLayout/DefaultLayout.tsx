import type { ReactNode } from "react";
import { Container, Flex, Button } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import paths from "../../routes/paths";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="4">
        <Flex justify="end">
          <Link to={paths.settings}>
            <Button variant="outline" size="2">
              Settings
            </Button>
          </Link>
        </Flex>
        {children}
      </Flex>
    </Container>
  );
};

export default DefaultLayout;
