/*
 * Copyright 2018 吴汶泽(wenzewoo@gmail.com)
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.hcybi.authority.service;

import com.hcybi.authority.feign.UserFeignClient;
import com.hcybi.common.entity.User;
import com.hcybi.common.web.entity.RetEntity;
import lombok.extern.log4j.Log4j;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

/**
 * @author by wenzewoo on 2018/2/7.
 */
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserFeignClient userFeignClient;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        RetEntity<User> retEntity = userFeignClient.findByUsername(username);
        if(!retEntity.isStatus()) {
            log.error("loadUserByUsername: " + retEntity.getMessage());
            throw new UsernameNotFoundException(retEntity.getMessage());
        }
        return new CustomUserDetails(retEntity.getBody());
    }
}
