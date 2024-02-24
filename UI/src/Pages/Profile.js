import { TextField, InputLabel, Checkbox } from '@mui/material';
import { Box } from '@mui/system';
import React, { Fragment, useState } from 'react';
import { profileFormList } from '../helper/profile-data';
import CustomSelect from '../Components/CustomSelect';
import '../Styles/Profile.css';

function Profile() {
  const [isValidEmail, setIsValidEmail] = useState(false);

  const [inputs, setInputs] = useState({
    openToWork: false,
    skills: [],
    baselocation: '',
    preferredlocation: ''
  });
  const handleChange = (event) => {
    if (event.target.name === 'email') {
      setIsValidEmail(event.target.value.includes('@persistent.com'));
    } else {
      setIsValidEmail(false);
    }
    setInputs((values) => ({
      ...values,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('inputs: ', inputs);
  };

  return (
    <div className="profileContainer">
      <p className="formHeader">Share your Profile</p>
      <Box className="boxContainer">
        <form
          onSubmit={handleSubmit}
          className="formContainer"
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          {profileFormList.map((formData) => {
            if (formData.type === 'dropdown') {
              return (
                // <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                //   <InputLabel>{formData.label}</InputLabel>
                <CustomSelect
                  label={formData.label}
                  name={formData.id}
                  value={inputs[formData.id]}
                  onChange={handleChange}
                  items={formData.items}
                  isMulti={formData.isMultiSelect}
                />
                // </FormControl>
                // <div key={formData.id} className="dropdown">
                // </div>
              );
            } else if (formData.type === 'checkbox') {
              return (
                <div className="openToWorkContainer" key={formData.id}>
                  <Checkbox
                    className="checkBox"
                    name={formData.id}
                    checked={inputs[formData.id]}
                    onChange={(e) =>
                      setInputs((values) => ({
                        ...values,
                        [formData.id]: e.target.checked
                      }))
                    }
                  />
                  <InputLabel className="openToWorkLabel">
                    {formData.label}
                  </InputLabel>
                </div>
              );
            }
            return (
              <TextField
                className="textFiled"
                key={formData.id}
                id={formData.id}
                type={formData.type ?? 'text'}
                name={formData.id}
                label={formData.label}
                variant="standard"
                value={inputs[formData.id] || ''}
                onChange={handleChange}
                error={formData.type === 'email' ? !isValidEmail : false}
                helperText={
                  formData.type === 'email'
                    ? 'Incorrect email. Please enter Persistent email id.'
                    : 'Enter valid input'
                }
              />
            );
          })}
          <input type="submit" className="submitButton" />
        </form>
      </Box>
    </div>
  );
}

export default Profile;
