import { Request, Response } from 'express';
import { apiSuccess } from '../api/success.api';
import CustomError from '../errors/custom.error';
import { cartController } from './cart.controller';
import { UpdateAction } from '@commercetools/sdk-client-v2';
import { Customer } from '@commercetools/platform-sdk';
import * as crypto from 'crypto';

/**
 * Exposed service endpoint.
 * - Receives a POST request, parses the action and the controller
 * and returns it to the correct controller. We should be use 3. `Cart`, `Order` and `Payments`
 *
 * @param {Request} request The express request
 * @param {Response} response The express response
 * @returns
 */
export const post = async (request: Request, response: Response) => {
  // Deserialize the action and resource from the body
  const { action, resource } = request.body;

  if (!action || !resource) {
    throw new CustomError(400, 'Bad request - Missing body parameters.');
  }

  // Identify the type of resource in order to redirect
  // to the correct controller
  switch (resource.typeId) {
    case 'cart':
      try {
        const data = await cartController(action, resource);

        if (data && data.statusCode === 200) {
          apiSuccess(200, data.actions, response);
          return;
        }

        throw new CustomError(
          data ? data.statusCode : 400,
          JSON.stringify(data)
        );
      } catch (error) {
        if (error instanceof Error) {
          throw new CustomError(500, error.message);
        }
      }

      break;
    case 'payment':
      break;

    case 'order':
      break;
    
    case 'customer':
      try {
        const updateActions: Array<UpdateAction> = [];
        const customer = JSON.parse(JSON.stringify(resource)) as Customer;
        if (customer.customerNumber !== undefined) {
          response.status(200).send()
          return
        }
        const updateAction: UpdateAction = { // Create the UpdateActions Object to return it to the client
          action: "setCustomerNumber",
          customerNumber: generateNumber(customer.id)
        }
        updateActions.push(updateAction);
        response.json({actions: updateActions}).status(200).send()
        return
      } catch (error) {
        if (error instanceof Error) {
          throw new CustomError(500, error.message);
        }
      }
      break

    default:
      throw new CustomError(
        500,
        `Internal Server Error - Resource not recognized. Allowed values are 'cart', 'payments' or 'orders'.`
      );
  }
};

function generateNumber(id: string): string {
  return crypto.createHash('md5').update(id).digest('hex');
}