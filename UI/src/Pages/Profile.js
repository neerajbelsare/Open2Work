import { TextField, InputLabel, Checkbox } from '@mui/material';
import { Box } from '@mui/system';
import React, { Fragment, useState } from 'react';
import { profileFormList } from '../helper/profile-data';
import CustomSelect from '../Components/CustomSelect';
import '../Styles/Profile.css';
import {
  getRegisteredEmployeeDetail,
  registerEmployee,
  updateEmployee
} from '../api/use-employee-api';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
// Get QueryClient from the context
function Profile() {
  // const [isValidEmail, setIsValidEmail] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isUpdate, setIsUpdate] = useState(false);

  const [inputs, setInputs] = useState({
    openToWork: true,
    baselocation: '',
    preferredlocation: ''
  });

  const goToDashboard = () => {
    navigate('/');
  };

  const handleChange = (event) => {
    setInputs((values) => ({
      ...values,
      [event.target.name]: event.target.value
    }));
  };

  const handleOnBlur = (id) => {
    console.log(id);
    if (id == 'email') {
      getRegisteredEmployeeDetail(inputs['email'])
        .then((res) => {
          console.log('res: ', res);
          const data = res[0];
          let tempOpenToWork = true;
          if (data['open2work'] === 0) {
            tempOpenToWork = false;
          }
          const finalInput = {
            email: data['email'],
            fullname: data['name'],
            baselocation: data['location'],
            preferredlocation: data['preferred_location'],
            openToWork: tempOpenToWork,
            skills: data['key_skills'],
            experience: Number(data['yrs_exp'])
          };
          setInputs(finalInput);
          setIsUpdate(true);
        })
        .catch((e) => {
          console.log(e);
          setIsUpdate(false);
        });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('inputs: ', inputs);
    // employee['email'], employee['name'], employee['location'], employee['preferred_location'], employee['yrs_exp'],
    //  employee['open2work'], employee['key_skills'])
    let isOpenToWork = 0;
    if (inputs['openToWork']) {
      isOpenToWork = 1;
    }
    if (isUpdate) {
      updateEmployee({
        email: inputs['email'],
        name: inputs['fullname'],
        location: inputs['baselocation'],
        preferred_location: inputs['preferredlocation'],
        open2work: isOpenToWork,
        key_skills: inputs['skills'],
        yrs_exp: Number(inputs['experience'])
      }).then((res) => {
        console.log('Res: ', res);
        queryClient.invalidateQueries({ queryKey: ['employees'] });
        navigate('/');
      });
    } else {
      registerEmployee({
        email: inputs['email'],
        name: inputs['fullname'],
        location: inputs['baselocation'],
        preferred_location: inputs['preferredlocation'],
        open2work: isOpenToWork,
        key_skills: inputs['skills'],
        yrs_exp: Number(inputs['experience'])
      }).then((res) => {
        console.log('Res: ', res);
        queryClient.invalidateQueries({ queryKey: ['employees'] });
        navigate('/');
      });
    }
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
                  key={formData.id}
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
                    sx={{
                      color: '#fd5f07',
                      '&.Mui-checked': {
                        color: '#fd5f07'
                      }
                    }}
                  />
                  <InputLabel className="openToWorkLabel">
                    {formData.label}
                  </InputLabel>
                </div>
              );
            }
            let limits = {};
            if (formData.type == 'number') {
              limits = { min: 0, max: 30 };
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
                style={{ marginTop: 20 }}
                onBlur={() => {
                  handleOnBlur(formData.id);
                }}
                inputProps={{ ...limits }}
                // error={formData.type === 'email' ? !isValidEmail : false}
                // helperText={
                //   formData.type === 'email'
                //     ? 'Incorrect email. Please enter Persistent email id.'
                //     : 'Enter valid input'
                // }
              />
            );
          })}
          <div className="buttonContainer">
            <input type="submit" className="submitButton" />
            <button className="cancelButton" onClick={goToDashboard}>
              Cancel
            </button>
          </div>
        </form>
      </Box>
    </div>
  );
}

export default Profile;
