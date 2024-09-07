/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { formatCurrency, subtractDates } from "../../utils/helpers";
import { useCabins } from "../cabins/useCabins";
import { useCreateBooking } from "./useCreateBookin";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";
import SpinnerMini from "../../ui/SpinnerMini";
import Textarea from "../../ui/Textarea";
import styled from "styled-components";
import { useCountries } from "./useCountries";
import { useSettings } from "../settings/useSettings";

const Select = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  color: var(--color-grey-500);
  padding: 0.8rem 1.2rem;
  font-weight: 500;
  width: 25rem;
`;

function CreateBookingForm({ onCloseModal }) {
  const [isPaid, setIsPaid] = useState(false);
  const [hasBreakfast, setHasBreakfast] = useState(false);
  const [totalBookingPrice, setTotalBookingPrice] = useState(0);

  const { register, handleSubmit, reset, getValues, watch, formState } =
    useForm();
  const { isLoading: isLoadingCabins, cabins } = useCabins();
  const { settings, isLoadingSettings } = useSettings();
  const countries = useCountries();

  const { errors } = formState;
  const { createBooking, isCreating } = useCreateBooking();

  // Watch relevant fields
  const watchFields = watch([
    "startDate",
    "endDate",
    "numGuests",
    "hasBreakfast",
    "cabinId",
  ]);

  // Calculate total price before submitting
  useEffect(() => {
    const calculateTotalPrice = () => {
      if (!isLoadingCabins && !isLoadingSettings) {
        const data = getValues();
        const cabin = cabins.find((cabin) => cabin.id === Number(data.cabinId));
        if (!cabin) return;

        const numNights = subtractDates(data.endDate, data.startDate);
        const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
        const extrasPrice = data.hasBreakfast
          ? numNights * 15 * data.numGuests * settings?.breakfastPrice
          : 0; // hardcoded breakfast price
        const totalPrice = cabinPrice + extrasPrice;

        setTotalBookingPrice(totalPrice);
      }
    };

    calculateTotalPrice();
  }, [
    watchFields,
    cabins,
    getValues,
    settings,
    isLoadingSettings,
    isLoadingCabins,
  ]);

  if (isLoadingCabins) return <Spinner />;

  function onSubmit(data) {
    const countryFlag = countries.find(
      (country) => country.name === data.nationality
    ).flag;

    const cabin = cabins.find((cabin) => cabin.id === Number(data.cabinId));
    if (!cabin) {
      return toast.error("Cabin not found");
    }

    const newBooking = {
      startDate: data.startDate,
      endDate: data.endDate,
      numNights: subtractDates(data?.endDate, data?.startDate),
      numGuests: data.numGuests,
      cabinPrice: totalBookingPrice,
      extrasPrice: hasBreakfast
        ? totalBookingPrice - cabin.regularPrice * data.numGuests
        : 0,
      totalPrice: totalBookingPrice,
      status: data?.status,
      hasBreakfast,
      isPaid,
      observations: data?.observations,
    };

    const guest = {
      fullName: data?.fullName,
      email: data?.email,
      nationalID: data?.nationalID,
      nationality: data?.nationality,
      countryFlag,
    };

    createBooking(
      { newBooking, guest, cabinId: data.cabinId },
      {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      }
    );
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isCreating}
          {...register("fullName", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="text"
          id="email"
          disabled={isCreating}
          {...register("email", {
            required: "This field is required.",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address.",
            },
          })}
        />
      </FormRow>

      <FormRow label="National Id" error={errors?.nationalID?.message}>
        <Input
          type="text"
          id="nationalID"
          disabled={isCreating}
          {...register("nationalID", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Nationality" error={errors?.nationality?.message}>
        <Select
          id="nationality"
          {...register("nationality")}
          disabled={isCreating}
        >
          {countries.map((country) => (
            <option value={country.name} key={country.flag}>
              {country.name}
            </option>
          ))}
        </Select>
      </FormRow>

      <FormRow label="Cabin" error={errors?.cabinId?.message}>
        <Select id="cabinId" {...register("cabinId")} disabled={isCreating}>
          {cabins.map((cabin) => (
            <option value={cabin.id} key={cabin.id}>
              {cabin.name}
            </option>
          ))}
        </Select>
      </FormRow>

      <FormRow label="Start date" error={errors?.startDate?.message}>
        <Input
          type="date"
          id="startDate"
          disabled={isCreating}
          {...register("startDate", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="End date" error={errors?.endDate?.message}>
        <Input
          type="date"
          id="endDate"
          disabled={isCreating}
          {...register("endDate", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Number of guests" error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          disabled={isCreating}
          defaultValue={1}
          {...register("numGuests", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Minimum number of guests is 1",
            },
            max: {
              value: 8,
              message: "Maximum number of guests is 8",
            },
          })}
        />
      </FormRow>

      <FormRow label="Status" error={errors?.status?.message}>
        <Input
          type="text"
          id="status"
          disabled={isCreating}
          defaultValue="unconfirmed"
          {...register("status", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Observations" error={errors?.observations?.message}>
        <Textarea
          type="text"
          id="observations"
          disabled={isCreating}
          defaultValue=""
          {...register("observations", {
            required: false,
          })}
        />
      </FormRow>

      <FormRow label="Has breakfast" error={errors?.hasBreakfast?.message}>
        <Input
          type="checkbox"
          id="hasBreakfast"
          checked={hasBreakfast}
          onClick={() => setHasBreakfast((has) => !has)}
          disabled={isCreating}
          defaultValue={false}
          {...register("hasBreakfast")}
        />
      </FormRow>

      <FormRow label="Paid" error={errors?.isPaid?.message}>
        <Input
          type="checkbox"
          id="isPaid"
          checked={isPaid}
          onClick={() => setIsPaid((paid) => !paid)}
          disabled={isCreating}
          defaultValue={false}
          {...register("isPaid")}
        />
      </FormRow>

      <FormRow>
        {totalBookingPrice !== 0 && !isNaN(totalBookingPrice) && (
          <p>Total price: {formatCurrency(totalBookingPrice)}</p>
        )}
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isCreating}>
          {!isCreating ? "Create booking" : <SpinnerMini />}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
