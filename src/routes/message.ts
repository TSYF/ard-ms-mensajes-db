import { ErrorBody } from '@/types/ErrorBody';
import { CommonResponseBody } from '@/types/CommonResponseBody';
import express from 'express';
import { matches } from '@/utils';
import { Message, messageMatcher } from '../types/Message';
import { db } from '@/db';
import { messageModel } from '@/db/schemas';
import { eq, inArray } from 'drizzle-orm';
const router = express.Router();

//* Index
router.get(
    "/",
    async (req, res) => {
        const messages: Message[] = await db
            .select()
            .from(messageModel);
        
        if (Array.isArray(messages)) {
            res.status(200).send(messages);
        } else {
            const CODE = 500;
            const error: ErrorBody = {
                private: "La lista de mensajes no pasa el typecheck de array en Index",
                public: new CommonResponseBody(
                    false,
                    CODE,
                    {
                        message: "¡Ha ocurrido un problema inesperado!"
                    }
                )
            }
            console.log(error.private);
            res.status(CODE).send(error.public);
        }
    }
);

//* Show
router.get(
    "/:id",
    async (req, res) => {
        const { id } = req.params;

        const message: Message = (await db
            .select()
            .from(messageModel)
            .where(eq(messageModel.id, +id)))[0];
        
        console.log(message)
        console.log(id)
        res.status(200).send(message);
    }
);

//* ShowList
router.get(
    "/list/:ids",
    async (req, res) => {
        const { ids } = req.body;

        const messages: Message[] = await db
            .select()
            .from(messageModel)
            .where(inArray(messageModel.id, ids.split(",")));
            
        res.status(200).send(messages);
    }
);

//* Store
router.post(
    "/",
    async (req, res) => {

        const message = req.body;
        console.table(message);

        if (!matches(message, messageMatcher)) {
            const CODE = 422;
            
            const error: ErrorBody = {
                private: "La forma del cuerpo no corresponde al Mensaje",
                public: new CommonResponseBody(
                    false,
                    CODE,
                    {
                        message: "La forma del cuerpo no corresponde al Mensaje"
                    }
                )
            }
            console.table(message);
            console.log(error.private);
            console.error(error.errorObject)
            res.status(CODE).send(error.public);
            return;
        }

        console.table(message);

        const insertedMessage = (await db.insert(messageModel).values(message).returning())[0];


        if (!insertedMessage) {
            const CODE = 500;

            const error: ErrorBody = {
                private: "Inserción no retorna fila insertada",
                public: new CommonResponseBody(
                    false,
                    CODE,
                    {
                        message: "¡Ha ocurrido un problema inesperado!"
                    }
                )
            }
            console.log(error.private);
            console.error(error.errorObject)
            res.status(CODE).send(error.public);
            return;
        }

        res.status(200).send(insertedMessage);
    }
)


module.exports = router;
export default router;